import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Map from '@/components/Map';
import VolunteerReviewForm from '@/components/VolunteerReviewForm';
import TaskManager from '@/components/TaskManager';

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
  organizationId: string;
}

interface Submission {
  id: string;
  status: string;
  description: string | null;
  createdAt: string;
  volunteerId: string;
  volunteerName?: string;
  volunteerEmail?: string;
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewedVolunteers, setReviewedVolunteers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);

      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from('Event')
        .select('*')
        .eq('id', id)
        .eq('organizationId', DEMO_ORG_ID)
        .single();

      if (eventError) throw eventError;
      if (!eventData) {
        toast({
          title: "Błąd",
          description: "Nie znaleziono wydarzenia lub nie masz do niego dostępu.",
          variant: "destructive",
        });
        navigate('/organizator');
        return;
      }

      setEvent(eventData);

      // Fetch submissions with volunteer data
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('Submission')
        .select('*')
        .eq('eventId', id)
        .order('createdAt', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch volunteer names
      const submissionsWithNames = await Promise.all(
        (submissionsData || []).map(async (submission) => {
          const { data: volunteer } = await supabase
            .from('Volunteer')
            .select('name, email')
            .eq('id', submission.volunteerId)
            .single();

          return {
            id: submission.id,
            status: submission.status,
            description: (submission as any).description || null,
            createdAt: submission.createdAt,
            volunteerId: submission.volunteerId,
            volunteerName: volunteer?.name || 'Nieznany',
            volunteerEmail: volunteer?.email || ''
          };
        })
      );

      setSubmissions(submissionsWithNames);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać danych wydarzenia.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (submissionId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const { error } = await supabase
        .from('Submission')
        .update({
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: `Zgłoszenie zostało ${newStatus === 'APPROVED' ? 'zaakceptowane' : 'odrzucone'}.`,
      });

      // Refresh submissions
      fetchEventDetails();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować zgłoszenia.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Oczekuje</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Zaakceptowane</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Odrzucone</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Ukończone</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filterSubmissions = (status?: string) => {
    if (!status) return submissions;
    return submissions.filter(s => s.status === status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ładowanie...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nie znaleziono wydarzenia</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/organizator')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do panelu
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Szczegóły wydarzenia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rozpoczęcie</p>
                    <p className="font-medium text-foreground">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Zakończenie</p>
                    <p className="font-medium text-foreground">{formatDate(event.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Miejsce</p>
                    <p className="font-medium text-foreground">{event.placeName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {event.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Opis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Lokalizacja</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <Map
                    latitude={event.latitude}
                    longitude={event.longitude}
                    placeName={event.placeName}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions and Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Zgłoszenia ({submissions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">
                      Wszystkie ({submissions.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Oczekujące ({filterSubmissions('PENDING').length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Zaakceptowane ({filterSubmissions('APPROVED').length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Odrzucone ({filterSubmissions('REJECTED').length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4 mt-6">
                    {submissions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Brak zgłoszeń
                      </p>
                    ) : (
                      submissions.map((submission) => (
                        <SubmissionCard
                          key={submission.id}
                          submission={submission}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4 mt-6">
                    {filterSubmissions('PENDING').map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="approved" className="space-y-4 mt-6">
                    {filterSubmissions('APPROVED').map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="rejected" className="space-y-4 mt-6">
                    {filterSubmissions('REJECTED').map((submission) => (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Task Manager Section */}
            <TaskManager 
              eventId={event.id}
              approvedVolunteers={filterSubmissions('APPROVED').map(s => ({
                id: s.volunteerId,
                name: s.volunteerName || 'Wolontariusz'
              }))}
            />

            {/* Reviews Section */}
            {filterSubmissions('APPROVED').length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Opinie o wolontariuszach</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Wystaw opinię wolontariuszom, którzy brali udział w wydarzeniu
                  </p>
                  {filterSubmissions('APPROVED')
                    .filter(submission => !reviewedVolunteers.has(submission.volunteerId))
                    .map((submission) => (
                      <VolunteerReviewForm
                        key={submission.id}
                        volunteerId={submission.volunteerId}
                        volunteerName={submission.volunteerName || 'Wolontariusz'}
                        eventId={event?.id || ''}
                        onReviewSubmitted={() => {
                          setReviewedVolunteers(prev => new Set(prev).add(submission.volunteerId));
                        }}
                      />
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

interface SubmissionCardProps {
  submission: Submission;
  onStatusChange: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}

const SubmissionCard = ({ submission, onStatusChange }: SubmissionCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Oczekuje</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Zaakceptowane</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Odrzucone</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Ukończone</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{submission.volunteerName}</p>
              <p className="text-sm text-muted-foreground">{submission.volunteerEmail}</p>
            </div>
          </div>
          {getStatusBadge(submission.status)}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Zgłoszono: {formatDate(submission.createdAt)}
        </p>

        {submission.description && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground leading-relaxed">{submission.description}</p>
          </div>
        )}

        {submission.status === 'PENDING' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onStatusChange(submission.id, 'APPROVED')}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              Zaakceptuj
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onStatusChange(submission.id, 'REJECTED')}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Odrzuć
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDetails;
