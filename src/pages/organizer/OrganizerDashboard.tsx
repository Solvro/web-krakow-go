import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hardcoded organization ID for demo
const DEMO_ORG_ID = 'org-krakow-razem';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  placeName: string;
  topic: string;
  latitude: number;
  longitude: number;
}

interface EventWithSubmissions extends Event {
  submissionCount: number;
  pendingCount: number;
}

interface School {
  id: string;
  nazwa: string;
  liczba_uczniow: number;
}

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventWithSubmissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orgName, setOrgName] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);

  useEffect(() => {
    fetchOrganizerData();
    fetchSchools();
  }, []);

  const fetchOrganizerData = async () => {
    try {
      setIsLoading(true);

      // Fetch organization name
      const { data: org } = await supabase
        .from('Organization')
        .select('name')
        .eq('id', DEMO_ORG_ID)
        .single();

      if (org) {
        setOrgName(org.name);
      }

      // Fetch events for this organization
      const { data: eventsData, error: eventsError } = await supabase
        .from('Event')
        .select('*')
        .eq('organizationId', DEMO_ORG_ID)
        .order('startDate', { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch submission counts for each event
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { data: submissions } = await supabase
            .from('Submission')
            .select('status')
            .eq('eventId', event.id);

          const submissionCount = submissions?.length || 0;
          const pendingCount = submissions?.filter(s => s.status === 'PENDING').length || 0;

          return {
            ...event,
            submissionCount,
            pendingCount
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error('Error fetching organizer data:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać danych organizatora.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      setIsLoadingSchools(true);
      const response = await fetch('https://api.um.krakow.pl/opendata-oswiata-szkoly-ponadpodstawowe-liczba-uczniow/v1/uczniowie-szkoly-ponadpodstawowe-samorzadowe-2024-2025', {
        headers: {
          'accept': 'application/json'
        }
      });
      const data = await response.json();
      
      // Sort by number of students (descending)
      const sortedSchools = data.sort((a: School, b: School) => b.liczba_uczniow - a.liczba_uczniow);
      setSchools(sortedSchools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać listy szkół.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredSchools = schools.filter(school => 
    school.nazwa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Panel Organizatora</h1>
              <p className="text-muted-foreground mt-1">{orgName}</p>
            </div>
            <Button onClick={() => navigate('/organizator/nowe-wydarzenie')} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Dodaj wydarzenie
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Wszystkie wydarzenia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{events.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Oczekujące zgłoszenia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {events.reduce((sum, e) => sum + e.pendingCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Wszystkie zgłoszenia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {events.reduce((sum, e) => sum + e.submissionCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Twoje wydarzenia</h2>
          
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych wydarzeń</p>
                <Button onClick={() => navigate('/organizator/nowe-wydarzenie')}>
                  <Plus className="w-5 h-5 mr-2" />
                  Dodaj pierwsze wydarzenie
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card 
                  key={event.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/organizator/wydarzenie/${event.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{event.placeName}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {event.submissionCount} zgłoszeń
                        </span>
                      </div>
                      {event.pendingCount > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-sm font-semibold text-primary">
                            {event.pendingCount} nowych
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Schools Search */}
        <div className="space-y-6 mt-12">
          <h2 className="text-2xl font-bold text-foreground">Wyszukiwarka szkół</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Szukaj szkoły po nazwie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoadingSchools ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Ładowanie szkół...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSchools.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Nie znaleziono szkół</p>
                  </CardContent>
                </Card>
              ) : (
                filteredSchools.map((school) => (
                  <Card key={school.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{school.nazwa}</h3>
                          <p className="text-sm text-muted-foreground">
                            <Users className="w-4 h-4 inline mr-1" />
                            {school.liczba_uczniow} uczniów
                          </p>
                        </div>
                        <Button variant="outline">
                          Skontaktuj się z koordynatorem
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrganizerDashboard;
