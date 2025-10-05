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

      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
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
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{cert.Volunteer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.Event.title}
                    </p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Zatwierdzone
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Punkty</p>
                    <p className="font-medium">{cert.points}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Zadania</p>
                    <p className="font-medium">{cert.tasksCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data wystawienia</p>
                    <p className="font-medium">
                      {format(new Date(cert.issuedAt), 'dd MMM yyyy', { locale: pl })}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownloadCertificate(cert)}
                  variant="outline"
                  size="sm"
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
