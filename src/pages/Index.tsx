import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
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
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-asc');

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
  });

  const offers = events ? events.map(mapEventToVolunteerOffer) : [];

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

  return (
    <Layout title="Młody Kraków" showNotifications>
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
            <div className="px-6 py-4 border-b border-border bg-card sticky top-[130px] z-10 space-y-4">
              <div className="max-w-2xl">
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
              
              <div className="flex gap-2 flex-wrap items-center">
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="w-[180px]">
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
                  <SelectTrigger className="w-[150px]">
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
                    <Button variant="outline" size="icon">
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

                {(topicFilter !== 'all' || dateFilter !== 'all' || sortBy !== 'date-asc') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTopicFilter('all');
                      setDateFilter('all');
                      setSortBy('date-asc');
                    }}
                  >
                    Wyczyść filtry
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
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
              ) : filteredOffers.length > 0 ? (
                filteredOffers.map((offer) => (
                  <VolunteerCard key={offer.id} offer={offer} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nie znaleziono ofert pasujących do wyszukiwania
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mapa" className="m-0 flex-1">
            <div className="relative h-[calc(100vh-130px)]">
              {/* Search Bar */}
              <div className="absolute top-4 left-6 right-6 z-10">
                <div className="bg-card rounded-full shadow-lg flex items-center px-4 py-3 max-w-2xl">
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

              {/* Map */}
              <Map showAllEvents={true} />
            </div>

            {/* Offers Section */}
            {showOffers && (
              <div className="bg-card border-t border-border">
                <div className="px-6 py-4 flex justify-between items-center border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Dostępne Oferty</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowOffers(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </>
                  ) : error ? (
                    <p className="text-center text-destructive py-8">
                      Błąd podczas ładowania ofert
                    </p>
                  ) : filteredOffers.length > 0 ? (
                    filteredOffers.map((offer) => (
                      <VolunteerCard key={offer.id} offer={offer} />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Nie znaleziono ofert pasujących do wyszukiwania
                    </p>
                  )}
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
