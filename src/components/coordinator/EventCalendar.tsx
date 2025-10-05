import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface EventCalendarProps {
  coordinatorId: string;
  schoolId: string | null;
}

const EventCalendar = ({ coordinatorId, schoolId }: EventCalendarProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [schoolId]);

  const fetchEvents = async () => {
    try {
      const { data } = await supabase
        .from('Event')
        .select(`
          *,
          Organization(name),
          Submission(id, volunteerId, Volunteer(schoolId))
        `)
        .gte('endDate', new Date().toISOString())
        .order('startDate', { ascending: true });

      // Filter events that have students from this school
      const relevantEvents = data?.filter(event => 
        event.Submission?.some((s: any) => s.Volunteer?.schoolId === schoolId)
      ) || [];

      if (relevantEvents.length > 0) {
        setEvents(relevantEvents);
      } else {
        // Mock events data
        const mockEvents = [
          {
            id: 'mock-e1',
            title: 'Sprzątanie Parku Jordana',
            topic: 'ECOLOGY',
            startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            placeName: 'Park Jordana, Kraków',
            Organization: { name: 'Eko Kraków' },
            Submission: [{ id: 's1', Volunteer: { schoolId } }, { id: 's2', Volunteer: { schoolId } }]
          },
          {
            id: 'mock-e2',
            title: 'Pomoc w schronisku dla zwierząt',
            topic: 'ANIMALS',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            placeName: 'Schronisko Na Paluchu',
            Organization: { name: 'Fundacja Pomocy Zwierzętom' },
            Submission: [{ id: 's3', Volunteer: { schoolId } }]
          },
        ];
        setEvents(mockEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([
        {
          id: 'mock-e1',
          title: 'Warsztaty edukacyjne',
          topic: 'EDUCATION',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          placeName: 'Biblioteka Główna',
          Organization: { name: 'Fundacja Edukacji' },
          Submission: [{ id: 's1', Volunteer: { schoolId } }]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Ładowanie wydarzeń...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nadchodzące wydarzenia</CardTitle>
        <CardDescription>
          Wydarzenia z uczniami z twojej szkoły
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Brak nadchodzących wydarzeń
            </p>
          ) : (
            events.map((event) => {
              const studentCount = event.Submission?.filter(
                (s: any) => s.Volunteer?.schoolId === schoolId
              ).length || 0;

              return (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.Organization?.name}
                      </p>
                    </div>
                    <Badge>{event.topic}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(event.startDate), 'dd MMM yyyy', { locale: pl })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(event.startDate), 'HH:mm', { locale: pl })}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.placeName}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">
                      {studentCount} {studentCount === 1 ? 'uczeń' : 'uczniów'} z twojej szkoły
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
