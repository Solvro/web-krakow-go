import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  volunteerId: string | null;
  volunteerName?: string;
}

interface Volunteer {
  id: string;
  name: string;
}

interface TaskManagerProps {
  eventId: string;
  approvedVolunteers: Volunteer[];
}

const TaskManager = ({ eventId, approvedVolunteers }: TaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    volunteerId: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [eventId]);

  const fetchTasks = async () => {
    try {
      const { data: tasksData, error } = await supabase
        .from('Task')
        .select('*')
        .eq('eventId', eventId)
        .order('startDate', { ascending: true });

      if (error) throw error;

      // Fetch volunteer names for assigned tasks
      const tasksWithNames = await Promise.all(
        (tasksData || []).map(async (task) => {
          if (task.volunteerId) {
            const { data: volunteer } = await supabase
              .from('Volunteer')
              .select('name')
              .eq('id', task.volunteerId)
              .single();
            
            return { ...task, volunteerName: volunteer?.name || 'Nieznany' };
          }
          return task;
        })
      );

      setTasks(tasksWithNames);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać zadań.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        startDate: new Date(task.startDate).toISOString().slice(0, 16),
        endDate: new Date(task.endDate).toISOString().slice(0, 16),
        volunteerId: task.volunteerId || ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        volunteerId: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola.",
        variant: "destructive",
      });
      return;
    }

    try {
      const taskData = {
        eventId,
        title: formData.title,
        description: formData.description || null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        volunteerId: formData.volunteerId || null,
        updatedAt: new Date().toISOString(),
        isCompleted: false
      };

      if (editingTask) {
        const { error } = await supabase
          .from('Task')
          .update(taskData)
          .eq('id', editingTask.id);

        if (error) throw error;

        toast({
          title: "Sukces!",
          description: "Zadanie zostało zaktualizowane.",
        });
      } else {
        const { error } = await supabase
          .from('Task')
          .insert({
            id: `task-${Date.now()}`,
            ...taskData,
            createdAt: new Date().toISOString()
          });

        if (error) throw error;

        toast({
          title: "Sukces!",
          description: "Zadanie zostało utworzone.",
        });
      }

      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać zadania.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) return;

    try {
      const { error } = await supabase
        .from('Task')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: "Zadanie zostało usunięte.",
      });

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć zadania.",
        variant: "destructive",
      });
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Zadania ({tasks.length})</CardTitle>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Dodaj zadanie
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Brak zadań. Dodaj pierwsze zadanie.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      )}
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Start: {formatDate(task.startDate)}</p>
                        <p>Koniec: {formatDate(task.endDate)}</p>
                        {task.volunteerId && task.volunteerName && (
                          <div className="flex items-center gap-2 mt-2">
                            <User className="w-4 h-4" />
                            <span className="text-foreground font-medium">
                              Przypisano: {task.volunteerName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(task)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edytuj zadanie' : 'Nowe zadanie'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tytuł zadania *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Np. Pomoc przy rejestracji uczestników"
                />
              </div>
              <div>
                <Label htmlFor="description">Opis zadania</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Szczegółowy opis zadania..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="startDate">Data rozpoczęcia *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data zakończenia *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="volunteer">Przypisz wolontariusza</Label>
                <Select
                  value={formData.volunteerId}
                  onValueChange={(value) => setFormData({ ...formData, volunteerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz wolontariusza..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nie przypisany</SelectItem>
                    {approvedVolunteers.map((volunteer) => (
                      <SelectItem key={volunteer.id} value={volunteer.id}>
                        {volunteer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={handleSaveTask}>
                {editingTask ? 'Zapisz zmiany' : 'Utwórz zadanie'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
