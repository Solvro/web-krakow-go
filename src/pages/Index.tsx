import { useState } from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VolunteerCard from '@/components/VolunteerCard';
import Map from '@/components/Map';
import Layout from '@/components/Layout';
import { api } from '@/services/api';
import { mapEventToVolunteerOffer } from '@/utils/eventMapper';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOffers, setShowOffers] = useState(true);
  const [topicFilter, setTopicFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  // State to store the AI-powered recommendations
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const offers = events ? events.map(mapEventToVolunteerOffer) : [];

  const handleAIRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      // Mock volunteer ID - in production, get from auth context
      const volunteerId = 'vol-ania';
      
      const { data, error } = await supabase.functions.invoke('get-event-recommendations', {
        body: { 
          volunteerId,
          limit: 10,
          filters: {
            ...(topicFilter !== 'all' && { category: topicFilter }),
            ...(dateFilter !== 'all' && { dateRange: { start: new Date().toISOString() } }),
          }
        }
      });

      if (error) throw error;

      if (data?.recommendations?.length > 0) {
        // Map and store the recommendations, then switch the view
        const recommendedOffers = data.recommendations.map(mapEventToVolunteerOffer);
        setAiRecommendations(recommendedOffers);
        setShowAIRecommendations(true);
        toast.success(`Znaleziono ${data.recommendations.length} spersonalizowanych rekomendacji!`);
      } else {
        toast.info('Brak rekomendacji. Uzupełnij swój profil, aby otrzymać spersonalizowane propozycje.');
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      toast.error('Błąd podczas pobierania rekomendacji AI');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const clearFiltersAndResetView = () => {
    setTopicFilter('all');
    setDateFilter('all');
    setSortBy('date-asc');
    setSearchQuery('');
    // Hide AI recommendations and go back to the main list
    setShowAIRecommendations(false);
  };

  // Filter offers
  let filteredOffers = offers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter by topic
  if (topicFilter !== 'all') {
    filteredOffers = filteredOffers.filter((offer) => {
      const event = events?.find((e) => e.id === offer.id);
      return event?.topic === topicFilter;
    });
  }

  // Filter by date
  if (dateFilter !== 'all') {
    filteredOffers = filteredOffers.filter((offer) => offer.dateType === dateFilter);
  }

  // Sort offers
  filteredOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
      case 'date-desc':
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      case 'title-asc':
        return a.title.localeCompare(b.title, 'pl');
      case 'title-desc':
        return b.title.localeCompare(a.title, 'pl');
      default:
        return 0;
    }
  });
  
  // Decide which list to display: regular filtered list or AI recommendations
  const offersToDisplay = showAIRecommendations ? aiRecommendations : filteredOffers;

  const renderOfferList = () => (
    <>
      {isLoading ? (
        <>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </>
      ) : error ? (
        <p className="text-center text-destructive py-8">
          Błąd podczas ładowania ofert
        </p>
      ) : offersToDisplay.length > 0 ? (
        offersToDisplay.map((offer) => (
          <VolunteerCard key={offer.id} offer={offer} />
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">
          {showAIRecommendations 
            ? "Nie znaleziono dla Ciebie żadnych rekomendacji." 
            : "Nie znaleziono ofert pasujących do wyszukiwania"}
        </p>
      )}
    </>
  );

  return (
    <Layout showNotifications>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <Tabs defaultValue="lista" className="w-full flex-1 flex flex-col">
          <div className="bg-card border-b border-border sticky top-[73px] z-10">
            <TabsList className="bg-transparent border-0 h-auto p-0 w-full grid grid-cols-2">
              <TabsTrigger
                value="lista"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
              >
                Lista
              </TabsTrigger>
              <TabsTrigger
                value="mapa"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
              >
                Mapa
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="lista" className="m-0 flex-1 flex flex-col">
            <div className="py-4 border-b border-border bg-card sticky top-[130px] z-10 space-y-4">
              <div className="px-6 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Szukaj ofert"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto px-6">
                <div className="flex gap-2 items-center pb-2" style={{ minWidth: 'min-content' }}>
                  <Button 
                    variant="default" 
                    onClick={handleAIRecommendations}
                    disabled={isLoadingRecommendations}
                    className="gap-2 flex-shrink-0"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isLoadingRecommendations ? 'Ładowanie...' : 'Propozycje AI'}
                  </Button>

                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-[180px] flex-shrink-0">
                      <SelectValue placeholder="Kategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie kategorie</SelectItem>
                      <SelectItem value="ENVIRONMENT">Środowisko</SelectItem>
                      <SelectItem value="EDUCATION">Edukacja</SelectItem>
                      <SelectItem value="TECH">Technologia</SelectItem>
                      <SelectItem value="COMMUNITY">Społeczność</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[150px] flex-shrink-0">
                      <SelectValue placeholder="Data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie daty</SelectItem>
                      <SelectItem value="today">Dziś</SelectItem>
                      <SelectItem value="tomorrow">Jutro</SelectItem>
                      <SelectItem value="future">Później</SelectItem>
                    </SelectContent>
                  </Select>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="flex-shrink-0">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sortuj</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                        <DropdownMenuRadioItem value="date-asc">Data (od najwcześniejszej)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="date-desc">Data (od najpóźniejszej)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="title-asc">Nazwa (A-Z)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="title-desc">Nazwa (Z-A)</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {(topicFilter !== 'all' || dateFilter !== 'all' || sortBy !== 'date-asc' || showAIRecommendations) && (
                <div className="px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFiltersAndResetView}
                  >
                    Wyczyść filtry
                  </Button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {showAIRecommendations && (
                <div className="flex flex-wrap justify-between items-center bg-primary/10 p-3 rounded-lg mb-4 gap-2">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-primary">Twoje spersonalizowane rekomendacje</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAIRecommendations(false)}
                        className="gap-1.5 text-primary hover:text-primary hover:bg-primary/20"
                    >
                        Pokaż wszystkie
                        <X className="w-4 h-4" />
                    </Button>
                </div>
              )}
              {renderOfferList()}
            </div>
          </TabsContent>

          <TabsContent value="mapa" className="m-0 flex-1">
            <div className="relative h-full">
              <div className="absolute top-4 left-6 right-6 z-10">
                <div className="bg-card rounded-full shadow-lg flex items-center px-4 py-3 max-w-2xl mx-auto">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <Input
                    type="text"
                    placeholder="Szukaj ofert"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  />
                </div>
              </div>
              <Map showAllEvents={true} />
            </div>

            {showOffers && (
              <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border max-h-[40vh] flex flex-col">
                <div className="px-6 py-4 flex justify-between items-center border-b border-border flex-shrink-0">
                  <h2 className="text-xl font-semibold text-foreground">Dostępne Oferty</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowOffers(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                   {renderOfferList()}
                </div>
              </div>
            )}

            {!showOffers && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
                <Button onClick={() => setShowOffers(true)} className="shadow-lg">
                  Pokaż oferty
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
