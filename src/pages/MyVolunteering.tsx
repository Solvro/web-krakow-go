import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { mockApplications, ApplicationStatus } from '@/data/mockApplications';
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

const MyVolunteering = () => {
  const navigate = useNavigate();
  
  const currentApplications = mockApplications.filter(
    app => app.status === 'accepted' || app.status === 'pending'
  );
  
  const completedApplications = mockApplications.filter(
    app => app.status === 'completed'
  );

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 font-semibold px-4 py-1">
            Zaakceptowane
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 font-semibold px-4 py-1">
            Oczekuje na akceptację
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-semibold px-4 py-1">
            Odrzucone
          </Badge>
        );
      default:
        return null;
    }
  };

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
                  onClick={() => navigate(`/oferta/${app.offerId}`)}
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
                  onClick={() => navigate(`/oferta/${app.offerId}`)}
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
