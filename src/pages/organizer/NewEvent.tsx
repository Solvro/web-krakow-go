import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hardcoded organization ID for demo
const DEMO_ORG_ID = 'org-krakow-razem';

const TOPICS = [
  { value: 'ECOLOGY', label: 'Ekologia' },
  { value: 'EDUCATION', label: 'Edukacja' },
  { value: 'CULTURE', label: 'Kultura' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'HEALTH', label: 'Zdrowie' },
  { value: 'SOCIAL', label: 'Pomoc społeczna' },
  { value: 'ANIMALS', label: 'Zwierzęta' },
  { value: 'OTHER', label: 'Inne' }
];

const NewEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    placeName: '',
    latitude: 50.0647,
    longitude: 19.9450,
    startDate: '',
    endDate: ''
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.topic || !formData.placeName || !formData.startDate || !formData.endDate) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('Event')
        .insert([{
          id: `event-${Date.now()}`,
          title: formData.title,
          description: formData.description || null,
          topic: formData.topic as any,
          placeName: formData.placeName,
          latitude: formData.latitude,
          longitude: formData.longitude,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          organizationId: DEMO_ORG_ID,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: "Wydarzenie zostało utworzone.",
      });

      navigate('/organizator');
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Błąd",
        description: "To na razie koncept :) Jeszcze nie działa",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/organizator')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do panelu
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Nowe wydarzenie</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dane wydarzenia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tytuł wydarzenia <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Np. Sprzątanie lasu w Krakowie"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Opis wydarzenia</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Opisz szczegóły wydarzenia..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic">
                  Kategoria <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.topic} onValueChange={(value) => handleChange('topic', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Place */}
              <div className="space-y-2">
                <Label htmlFor="placeName">
                  Miejsce <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="placeName"
                  value={formData.placeName}
                  onChange={(e) => handleChange('placeName', e.target.value)}
                  placeholder="Np. Park Jordana"
                  required
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Szerokość geograficzna</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Długość geograficzna</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Data rozpoczęcia <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    Data zakończenia <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/organizator')}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Anuluj
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Tworzenie...' : 'Utwórz wydarzenie'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewEvent;
