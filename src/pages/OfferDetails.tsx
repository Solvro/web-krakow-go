import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { mockOffers } from '@/data/mockOffers';

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const offer = mockOffers.find(o => o.id === id);

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nie znaleziono oferty</p>
      </div>
    );
  }

  return (
    <Layout title="Szczegóły oferty" showBackButton>
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
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

      {/* Fixed Bottom Button */}
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
    </Layout>
  );
};

export default OfferDetails;
