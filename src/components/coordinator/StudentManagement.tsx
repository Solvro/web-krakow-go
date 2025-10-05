import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface StudentManagementProps {
  schoolId: string | null;
}

const StudentManagement = ({ schoolId }: StudentManagementProps) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [schoolId]);

  const fetchStudents = async () => {
    try {
      const { data } = await supabase
        .from('Volunteer')
        .select(`
          *,
          Submission(id, status, Event(title))
        `)
        .eq('schoolId', schoolId)
        .order('points', { ascending: false });

      if (data && data.length > 0) {
        setStudents(data);
      } else {
        // Mock data when no real data exists
        const mockStudents = [
          {
            id: 'mock-v1',
            name: 'Anna Kowalska',
            email: 'anna.kowalska@student.pl',
            points: 150,
            birthdate: '2006-05-15',
            Submission: [
              { id: 's1', status: 'APPROVED', Event: { title: 'Sprzątanie parku' } },
              { id: 's2', status: 'APPROVED', Event: { title: 'Pomoc w schronisku' } },
            ]
          },
          {
            id: 'mock-v2',
            name: 'Jan Nowak',
            email: 'jan.nowak@student.pl',
            points: 120,
            birthdate: '2005-08-22',
            Submission: [
              { id: 's3', status: 'APPROVED', Event: { title: 'Zbiórka żywności' } },
            ]
          },
          {
            id: 'mock-v3',
            name: 'Katarzyna Wiśniewska',
            email: 'kasia.w@student.pl',
            points: 95,
            birthdate: '2006-11-03',
            Submission: [
              { id: 's4', status: 'APPROVED', Event: { title: 'Warsztaty edukacyjne' } },
              { id: 's5', status: 'APPROVED', Event: { title: 'Akcja krwiodawstwa' } },
            ]
          },
        ];
        setStudents(mockStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Fallback to mock data on error
      setStudents([
        {
          id: 'mock-v1',
          name: 'Anna Kowalska',
          email: 'anna.kowalska@student.pl',
          points: 150,
          birthdate: '2006-05-15',
          Submission: [
            { id: 's1', status: 'APPROVED', Event: { title: 'Sprzątanie parku' } },
          ]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Ładowanie uczniów...</div>;
  }

  if (!schoolId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Brak przypisanej szkoły</CardTitle>
          <CardDescription>
            Nie możesz zarządzać uczniami bez przypisanej szkoły.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Uczniowie ze szkoły</CardTitle>
          <CardDescription>
            Lista wszystkich uczniów zarejestrowanych jako wolontariusze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Brak zarejestrowanych uczniów
              </p>
            ) : (
              students.map((student) => {
                const activeApplications = student.Submission?.filter(
                  (s: any) => s.status === 'APPROVED'
                ).length || 0;

                return (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="flex-shrink-0">
                        <AvatarFallback>
                          {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Trophy className="w-4 h-4 text-primary" />
                          {student.points} pkt
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {activeApplications} aktywnych projektów
                        </p>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        {new Date().getFullYear() - new Date(student.birthdate).getFullYear()} lat
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
