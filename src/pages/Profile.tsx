import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Pencil, TrendingUp } from 'lucide-react';
import BadgeCard from '@/components/BadgeCard';
import { mockBadges } from '@/data/mockBadges';
import { api } from '@/services/api';
import { generateCertificate } from '@/utils/certificateGenerator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ekoInicjatywa from '@/assets/badges/eko-inicjatywa.png';
import straznikCzystosci from '@/assets/badges/straznik-czystosci.png';
import pomocnaLapa from '@/assets/badges/pomocna-lapa.png';
import adopcyjnyCzarodziej from '@/assets/badges/adopcyjny-czarodziej.png';
import perfekcyjnyPlan from '@/assets/badges/perfekcyjny-plan.png';
import liderZespolu from '@/assets/badges/lider-zespolu.png';
import mistrzLogistyki from '@/assets/badges/mistrz-logistyki.png';

const Profile = () => {
  const { volunteerId } = useParams();
  const [volunteer, setVolunteer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<{ [key: string]: any }>({});
  const [schoolName, setSchoolName] = useState<string>('');

  useEffect(() => {
    const fetchVolunteer = async () => {
      if (!volunteerId) return;
      
      try {
        setIsLoading(true);
        const data = await api.getVolunteerById(volunteerId);
        if (data) {
          setVolunteer(data);
          
          // Fetch school name if schoolId exists
          if (data.schoolId) {
            const { data: school } = await supabase
              .from('School')
              .select('name')
              .eq('id', data.schoolId)
              .maybeSingle();
            
            if (school) {
              setSchoolName(school.name);
            }
          }
          
          // Fetch event details for all certificates
          const eventPromises = data.certificates.map((cert: any) => 
            api.getEventById(cert.eventId)
          );
          const eventData = await Promise.all(eventPromises);
          
          const eventsMap = eventData.reduce((acc, event) => {
            if (event) {
              acc[event.id] = event;
            }
            return acc;
          }, {} as { [key: string]: any });
          
          setEvents(eventsMap);
        } else {
          setError('Nie znaleziono wolontariusza');
        }
      } catch (err) {
        setError('Błąd podczas ładowania profilu');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVolunteer();
  }, [volunteerId]);
  const badgeImages: { [key: string]: string } = {
    'eko-inicjatywa': ekoInicjatywa,
    'straznik-czystosci': straznikCzystosci,
    'pomocna-lapa': pomocnaLapa,
    'adopcyjny-czarodziej': adopcyjnyCzarodziej,
    'perfekcyjny-plan': perfekcyjnyPlan,
    'lider-zespolu': liderZespolu,
    'mistrz-logistyki': mistrzLogistyki,
  };

  const badgesByCategory = mockBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as { [key: string]: typeof mockBadges });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ładowanie...</p>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{error || 'Nie znaleziono wolontariusza'}</p>
      </div>
    );
  }

  const age = Math.floor((new Date().getTime() - new Date(volunteer.birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const totalHours = volunteer.certificates.reduce((sum: number, cert: any) => sum + (cert.tasksCount * 2), 0);

  const handleDownloadCertificate = async (certificate: any) => {
    try {
      // Fetch event details for the certificate
      const event = await api.getEventById(certificate.eventId);
      
      if (!event) {
        toast.error('Nie udało się pobrać szczegółów wydarzenia');
        return;
      }

      // Fetch organization details
      const { data: organization } = await supabase
        .from('Organization')
        .select('name')
        .eq('id', event.organizationId)
        .maybeSingle();
      
      await generateCertificate({
        volunteerId: volunteer.id,
        volunteerName: volunteer.name,
        volunteerEmail: volunteer.email,
        eventId: certificate.eventId,
        eventTitle: event.title,
        organizationName: organization?.name || 'Organizacja',
        points: certificate.points,
        tasksCount: certificate.tasksCount,
        issuedAt: certificate.issuedAt,
        startDate: event.startDate,
        endDate: event.endDate,
      });
      
      toast.success('Certyfikat został pobrany');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Wystąpił błąd podczas generowania certyfikatu');
    }
  };

  return (
    <Layout title="Profil">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-8 pb-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="bg-orange-200 text-4xl">
                {volunteer.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">{volunteer.name}</h1>
            <p className="text-muted-foreground">{age} lata</p>
            <p className="text-muted-foreground">{volunteer.email}</p>
            {schoolName && <p className="text-muted-foreground">{schoolName}</p>}
          </div>
        </div>

        {/* Combined Stats Display */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Statystyki</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Punkty</p>
              <p className="text-4xl font-bold text-primary">{volunteer.points}</p>
            </div>
            <div className="bg-card rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Ranking szkoły</p>
              <div className="flex items-center gap-3">
                <p className="text-4xl font-bold text-primary">#{Math.max(1, 15 - volunteer.points)}</p>
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-semibold">+2</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Spędzone godziny</p>
              <p className="text-4xl font-bold text-primary">{totalHours} h</p>
            </div>
            <div className="bg-card rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Certyfikaty</p>
              <p className="text-4xl font-bold text-primary">{volunteer.certificates.length}</p>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Odznaki</h2>
          <div className="space-y-6">
            {Object.entries(badgesByCategory).map(([category, badges]) => (
              <div key={category}>
                <h3 className="text-sm font-medium mb-3">{category}</h3>
                <div className="flex gap-4">
                  {badges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      image={badgeImages[badge.image]}
                      title={badge.title}
                      earned={badge.earned}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates History */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Certyfikaty</h2>
          {volunteer.certificates.length > 0 ? (
            <div className="space-y-3">
              {volunteer.certificates.map((certificate: any) => (
                <div
                  key={certificate.id}
                  className="bg-card rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {events[certificate.eventId]?.title || 'Ładowanie...'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Punkty: {certificate.points} | Zadania: {certificate.tasksCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(certificate.issuedAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-primary"
                    onClick={() => handleDownloadCertificate(certificate)}
                  >
                    Pobierz
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Brak certyfikatów</p>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Profile;
