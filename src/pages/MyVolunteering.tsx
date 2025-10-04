import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle } from 'lucide-react';
import { mockApplications, ApplicationStatus } from '@/data/mockApplications';

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
                <Card 
                  key={app.id} 
                  className="p-5 bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/oferta/${app.offerId}`)}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {app.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {app.organizer}
                        </p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{app.date}</span>
                    </div>
                  </div>
                </Card>
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
                <Card 
                  key={app.id} 
                  className="p-5 bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/oferta/${app.offerId}`)}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {app.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {app.organizer}
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{app.date}</span>
                    </div>
                  </div>
                </Card>
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
