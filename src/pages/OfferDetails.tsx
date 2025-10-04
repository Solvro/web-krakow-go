import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Lightbulb, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { mockOffers } from '@/data/mockOffers';
import { mockApplications, ApplicationStatus } from '@/data/mockApplications';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  pending: { label: 'Zgłoszenie wysłane - Oczekuje na rozpatrzenie', color: 'text-blue-600' },
  accepted: { label: 'Zgłoszenie zaakceptowane', color: 'text-green-600' },
  rejected: { label: 'Zgłoszenie odrzucone', color: 'text-red-600' },
  completed: { label: 'Wydarzenie zakończone', color: 'text-gray-600' },
};

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  
  const offer = mockOffers.find(o => o.id === id);
  const application = mockApplications.find(app => app.offerId === id);

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nie znaleziono oferty</p>
      </div>
    );
  }

  const pageTitle = application 
    ? (application.status === 'accepted' ? 'Centrum Projektu' : 'Potwierdzenie zgłoszenia')
    : 'Szczegóły oferty';

  // Render accepted state with schedule
  if (application?.status === 'accepted') {
    return (
      <Layout title={pageTitle} showBackButton>
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {/* Event Header */}
            <div className="bg-card rounded-xl p-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {offer.title}
              </h2>
              <p className="text-muted-foreground">
                Organizacja "{offer.organizer}"
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="harmonogram" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="harmonogram">Harmonogram</TabsTrigger>
                <TabsTrigger value="szczegoly">Szczegóły</TabsTrigger>
                <TabsTrigger value="czaty">Czaty</TabsTrigger>
              </TabsList>

              <TabsContent value="harmonogram" className="mt-6">
                <div className="bg-card rounded-xl p-6 space-y-6">
                  {/* Schedule Header */}
                  <h3 className="text-xl font-bold text-foreground">
                    Plan działania - 15 czerwca 2024
                  </h3>

                {/* Timeline */}
                <div className="space-y-6 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-border" />

                  {/* Schedule Items */}
                  <div className="flex gap-4 relative">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10">
                      <span className="text-white font-semibold">1</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        10:00 - Zbiórka i odprawa
                      </h4>
                      <p className="text-muted-foreground">
                        Spotkanie przy pomniku A. Mickiewicza. Odbiór identyfikatorów, koszulek i przydział zadań.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10">
                      <span className="text-white font-semibold">2</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        11:00 - Pomoc w strefie warsztatowej
                      </h4>
                      <p className="text-muted-foreground">
                        Asystowanie przy warsztatach artystycznych dla dzieci. Zapewnienie materiałów i dbanie o porządek.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10">
                      <span className="text-white font-semibold">3</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        14:00 - Przerwa obiadowa
                      </h4>
                      <p className="text-muted-foreground">
                        Godzinna przerwa na posiłek w wyznaczonej strefie dla wolontariuszy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center z-10">
                      <span className="text-foreground font-semibold">4</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        15:00 - Obsługa punktu informacyjnego
                      </h4>
                      <p className="text-muted-foreground">
                        Udzielanie informacji uczestników festiwalu, kierowanie do odpowiednich stref.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center z-10">
                      <span className="text-foreground font-semibold">5</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        18:00 - Zakończenie i podsumowanie dnia
                      </h4>
                      <p className="text-muted-foreground">
                        Krótkie spotkanie podsumowujące, zdanie sprzętu i pożegnanie.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </TabsContent>

              <TabsContent value="szczegoly" className="mt-6">
                <div className="space-y-8">
                  {/* Informacje o projekcie */}
                  <div className="bg-card rounded-xl p-6 space-y-6">
                    <h3 className="text-xl font-bold text-foreground">Informacje o projekcie</h3>
                    
                    {/* Opis projektu */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Opis projektu</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    {/* Organizator */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Organizator</h4>
                      <p className="text-foreground mb-3">{offer.organizer}</p>
                      <div className="space-y-2">
                        <a href="tel:+48123456789" className="flex items-center gap-2 text-primary hover:underline">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          +48 123 456 789
                        </a>
                        <a href="mailto:kontakt@mdk.krakow.pl" className="flex items-center gap-2 text-primary hover:underline">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          kontakt@mdk.krakow.pl
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Szczegóły wydarzenia */}
                  <div className="bg-card rounded-xl p-6 space-y-6">
                    <h3 className="text-xl font-bold text-foreground">Szczegóły wydarzenia</h3>
                    
                    {/* Data i godzina */}
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <Calendar className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">Data i godzina</h4>
                        <p className="text-foreground">15 czerwca 2024 (Sobota)</p>
                        <p className="text-muted-foreground">Start: 10:00</p>
                        <p className="text-muted-foreground">Zakończenie: 18:00</p>
                      </div>
                    </div>

                    {/* Miejsce spotkania */}
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <MapPin className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">Miejsce spotkania</h4>
                        <p className="text-foreground">Rynek Główny, pomnik Adama Mickiewicza</p>
                        <p className="text-muted-foreground mb-3">31-042 Kraków</p>
                        {/* Placeholder dla mapy */}
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wymagane umiejętności */}
                  <div className="bg-card rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-bold text-foreground">Wymagane umiejętności</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        Komunikatywność
                      </span>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        Praca w zespole
                      </span>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        Dobra organizacja
                      </span>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        Pozytywne nastawienie
                      </span>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        Kreatywność
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="czaty" className="mt-6">
                <div className="bg-card rounded-xl p-6 text-center text-muted-foreground">
                  Zawartość w przygotowaniu
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={pageTitle} showBackButton>
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          {/* Application Status - shown when user has applied */}
          {application && (
            <div className="bg-accent/30 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-primary mb-3 text-center">
                Status zgłoszenia
              </h3>
              <p className={`text-lg font-bold text-center ${statusConfig[application.status].color}`}>
                {statusConfig[application.status].label}
              </p>
            </div>
          )}

          {/* Title and Description */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {offer.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {offer.description}
            </p>
          </div>

          {/* Information Section */}
          <div className="bg-card rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-foreground">Informacje</h3>
            
            <div className="space-y-5">
              {/* Date */}
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Data</h4>
                  <p className="text-muted-foreground">{offer.date || `${offer.dateLabel}, ${offer.time}`}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Lokalizacja</h4>
                  <p className="text-muted-foreground">{offer.location}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Wymagania</h4>
                  <p className="text-muted-foreground">
                    Komunikatywność, zaangażowanie
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Application - shown when user has applied */}
          {application && (
            <div className="bg-card rounded-xl overflow-hidden">
              <Collapsible open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-accent/5 transition-colors">
                  <h3 className="text-xl font-bold text-foreground">Twoje zgłoszenie</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${isApplicationOpen ? 'rotate-180' : ''}`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Data zgłoszenia</h4>
                      <p className="text-foreground">10 czerwca 2024</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Twoja wiadomość</h4>
                      <p className="text-foreground">
                        Jestem bardzo zainteresowany pomocą przy organizacji festiwalu. 
                        Mam doświadczenie w pracy z ludźmi i chętnie się zaangażuję.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {/* Contact Section */}
          <div className="bg-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Kontakt</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {(offer.organizer || 'Organizator').charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{offer.organizer || 'Organizator'}</h4>
                  <p className="text-sm text-muted-foreground">Organizator</p>
                </div>
              </div>
              
              <Button 
                size="icon"
                variant="outline"
                className="shrink-0 w-14 h-14 rounded-full bg-primary/5 border-primary/20 hover:bg-primary/10"
              >
                <MessageCircle className="w-6 h-6 text-primary" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button - only shown when user hasn't applied yet */}
      {!application && (
        <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-6 z-40">
          <div className="max-w-3xl mx-auto">
            <Button 
              className="w-full h-14 text-lg font-semibold rounded-xl"
              size="lg"
              onClick={() => navigate(`/oferta/${id}/zglos`)}
            >
              Zgłoś się
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OfferDetails;
