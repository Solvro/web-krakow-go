import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VolunteerCard from '@/components/VolunteerCard';
import Map from '@/components/Map';
import Layout from '@/components/Layout';
import { mockOffers } from '@/data/mockOffers';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOffers, setShowOffers] = useState(true);

  const filteredOffers = mockOffers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="px-6 py-4 border-b border-border bg-card sticky top-[130px] z-10">
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
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {filteredOffers.length > 0 ? (
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
              <Map />
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
                  {filteredOffers.length > 0 ? (
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
