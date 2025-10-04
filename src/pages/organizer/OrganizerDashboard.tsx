import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventWithSubmissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    fetchOrganizerData();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      </main>
    </div>
  );
};

export default OrganizerDashboard;
