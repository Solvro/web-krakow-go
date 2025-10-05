import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateCertificate } from '@/utils/certificateGenerator';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface CertificateManagementProps {
  schoolId: string | null;
}

const CertificateManagement = ({ schoolId }: CertificateManagementProps) => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schoolId) {
      fetchCertificates();
    }
  }, [schoolId]);

  const fetchCertificates = async () => {
    try {
      const { data } = await supabase
        .from('AttendanceCertificate')
        .select(`
          *,
          Volunteer!inner(*, School(name)),
          Event(title, Organization(name))
        `)
        .eq('Volunteer.schoolId', schoolId)
        .order('issuedAt', { ascending: false });

      if (data && data.length > 0) {
        setCertificates(data);
      } else {
        // Mock certificates
        const mockCerts = [
          {
            id: 'cert-1',
            volunteerId: 'mock-v1',
            eventId: 'mock-e1',
            points: 50,
            tasksCount: 5,
            issuedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            Volunteer: {
              name: 'Anna Kowalska',
              email: 'anna.kowalska@student.pl',
              School: { name: 'Szkoła Demonstracyjna' }
            },
            Event: {
              title: 'Sprzątanie Parku Jordana',
              Organization: { name: 'Eko Kraków' }
            }
          },
          {
            id: 'cert-2',
            volunteerId: 'mock-v2',
            eventId: 'mock-e2',
            points: 40,
            tasksCount: 4,
            issuedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            Volunteer: {
              name: 'Jan Nowak',
              email: 'jan.nowak@student.pl',
              School: { name: 'Szkoła Demonstracyjna' }
            },
            Event: {
              title: 'Pomoc w schronisku',
              Organization: { name: 'Fundacja Pomocy Zwierzętom' }
            }
          },
        ];
        setCertificates(mockCerts);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (cert: any) => {
    try {
      await generateCertificate({
        volunteerId: cert.volunteerId,
        volunteerName: cert.Volunteer.name,
        volunteerEmail: cert.Volunteer.email,
        eventId: cert.eventId,
        eventTitle: cert.Event.title,
        organizationName: cert.Event.Organization.name,
        points: cert.points,
        tasksCount: cert.tasksCount,
        issuedAt: cert.issuedAt,
      });

      toast.success('Zaświadczenie zostało pobrane');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Błąd podczas generowania zaświadczenia');
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Ładowanie zaświadczeń...</div>;
  }

  if (!schoolId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Brak przypisanej szkoły</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zaświadczenia o wolontariacie</CardTitle>
        <CardDescription>
          Zarządzaj zaświadczeniami dla uczniów z twojej szkoły
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Brak wystawionych zaświadczeń
            </p>
          ) : (
            certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{cert.Volunteer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.Event.title}
                    </p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1 self-start">
                    <CheckCircle className="w-3 h-3" />
                    Zatwierdzone
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Punkty</p>
                    <p className="font-semibold text-base sm:text-lg">{cert.points}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Zadania</p>
                    <p className="font-semibold text-base sm:text-lg">{cert.tasksCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Data wystawienia</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {format(new Date(cert.issuedAt), 'dd MMM yyyy', { locale: pl })}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownloadCertificate(cert)}
                  variant="outline"
                  size="default"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Pobierz zaświadczenie
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateManagement;
