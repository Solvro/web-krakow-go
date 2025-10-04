import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { api } from '@/services/api';
import { 
  EventCard, 
  EventHeader, 
  EventContent, 
  EventTitle, 
  EventOrganizer, 
  EventInfo, 
  EventBadge, 
  EventStatusCompleted 
} from '@/components/EventCard';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

type SubmissionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

interface Application {
  id: string;
  eventId: string;
  title: string;
  organizer: string;
  date: string;
  status: SubmissionStatus;
}

const MyVolunteering = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const submissions = await api.getVolunteerSubmissions('vol-ania');
        
        const mappedApplications: Application[] = submissions.map((sub: any) => {
          const event = sub.Event;
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          
          const dateStr = startDate.toDateString() === endDate.toDateString()
            ? format(startDate, 'd MMMM yyyy', { locale: pl })
            : `${format(startDate, 'd MMMM yyyy', { locale: pl })} - ${format(endDate, 'd MMMM yyyy', { locale: pl })}`;

          return {
            id: sub.id,
            eventId: event.id,
            title: event.title,
            organizer: event.Organization?.name || 'Nieznana organizacja',
            date: dateStr,
            status: sub.status,
          };
        });

        setApplications(mappedApplications);
      } catch (err) {
        setError('Nie udało się załadować zgłoszeń');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);
  
  const currentApplications = applications.filter(
    app => app.status === 'ACCEPTED' || app.status === 'PENDING'
  );
  
  const completedApplications = applications.filter(
    app => app.status === 'COMPLETED' || app => app.status === 'REJECTED'
  );

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 font-semibold px-4 py-1">
            Zaakceptowane
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 font-semibold px-4 py-1">
            Oczekuje na akceptację
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-semibold px-4 py-1">
            Odrzucone
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout title="Mój Wolontariat">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <p className="text-center text-muted-foreground">Ładowanie...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Mój Wolontariat">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <p className="text-center text-destructive">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mój Wolontariat">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-8">
        {/* Current and Pending Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Aktualne i Oczekujące
          </h2>
          
          <div className="space-y-4">
            {currentApplications.length > 0 ? (
              currentApplications.map((app) => (
                <EventCard 
                  key={app.id}
                  onClick={() => navigate(`/oferta/${app.eventId}`)}
                >
                  <EventHeader>
                    <EventContent>
                      <EventTitle title={app.title} />
                      <EventOrganizer organizer={app.organizer} />
                    </EventContent>
                    {getStatusBadge(app.status)}
                  </EventHeader>
                  
                  <EventInfo icon={Calendar} text={app.date} />
                </EventCard>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Brak aktualnych zgłoszeń
              </p>
            )}
          </div>
        </section>

        {/* Completed Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ukończone
          </h2>
          
          <div className="space-y-4">
            {completedApplications.length > 0 ? (
              completedApplications.map((app) => (
                <EventCard 
                  key={app.id}
                  onClick={() => navigate(`/oferta/${app.eventId}`)}
                >
                  <EventHeader>
                    <EventContent>
                      <EventTitle title={app.title} />
                      <EventOrganizer organizer={app.organizer} />
                    </EventContent>
                    <EventStatusCompleted />
                  </EventHeader>
                  
                  <EventInfo icon={Calendar} text={app.date} />
                </EventCard>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Brak ukończonych zgłoszeń
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MyVolunteering;
