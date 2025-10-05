import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface OrganizationContactProps {
  coordinatorId: string;
}

const OrganizationContact = ({ coordinatorId }: OrganizationContactProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: eventsData } = await supabase
      .from('Event')
      .select('*, Organization(name)')
      .gte('endDate', new Date().toISOString())
      .order('startDate', { ascending: true });

    const { data: studentsData } = await supabase
      .from('Volunteer')
      .select('*')
      .order('name');

    // Use real data if available, otherwise use mock data
    const events = eventsData && eventsData.length > 0 ? eventsData : [
      {
        id: 'mock-e1',
        title: 'Sprzątanie Parku Jordana',
        Organization: { name: 'Eko Kraków' }
      },
      {
        id: 'mock-e2',
        title: 'Pomoc w schronisku',
        Organization: { name: 'Fundacja Pomocy Zwierzętom' }
      },
    ];

    const students = studentsData && studentsData.length > 0 ? studentsData : [
      { id: 'mock-v1', name: 'Anna Kowalska', points: 150 },
      { id: 'mock-v2', name: 'Jan Nowak', points: 120 },
      { id: 'mock-v3', name: 'Katarzyna Wiśniewska', points: 95 },
    ];

    setEvents(events);
    setStudents(students);
  };

  const handleSendRecommendation = async () => {
    if (!selectedEvent || !selectedStudent || !message.trim()) {
      toast.error('Wypełnij wszystkie pola');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('EventRecommendation')
        .insert({
          id: crypto.randomUUID(),
          eventId: selectedEvent,
          volunteerId: selectedStudent,
          coordinatorId: coordinatorId,
          message: message.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Rekomendacja została wysłana do organizacji');
      setSelectedEvent('');
      setSelectedStudent('');
      setMessage('');
    } catch (error) {
      console.error('Error sending recommendation:', error);
      toast.error('Błąd podczas wysyłania rekomendacji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontakt z organizacjami</CardTitle>
        <CardDescription>
          Rekomenduj uczniów do projektów wolontariackich
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Wybierz wydarzenie</label>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz wydarzenie..." />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title} - {event.Organization?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Wybierz ucznia</label>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz ucznia..." />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.points} pkt)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Wiadomość do organizacji</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Opisz dlaczego ten uczeń byłby idealny do tego projektu..."
            rows={4}
          />
        </div>

        <Button
          onClick={handleSendRecommendation}
          disabled={loading}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Wyślij rekomendację
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrganizationContact;
