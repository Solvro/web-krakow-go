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
    if (schoolId) {
      fetchStudents();
    }
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

      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
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
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Trophy className="w-4 h-4 text-primary" />
                          {student.points} pkt
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activeApplications} aktywnych projektów
                        </p>
                      </div>
                      <Badge variant="secondary">
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
