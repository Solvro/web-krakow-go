import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
}

interface VolunteerTaskListProps {
  eventId: string;
  volunteerId: string;
}

const VolunteerTaskList = ({ eventId, volunteerId }: VolunteerTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [eventId, volunteerId]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Task')
        .select('*')
        .eq('eventId', eventId)
        .eq('volunteerId', volunteerId)
        .order('startDate', { ascending: true });

      if (error) throw error;

      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać zadań.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Twoje zadania</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">Ładowanie...</p>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return null; // Don't show the section if there are no tasks
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twoje zadania ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{task.title}</h4>
                  {task.isCompleted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Ukończone
                    </Badge>
                  )}
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {formatDate(task.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Koniec: {formatDate(task.endDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VolunteerTaskList;
