import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface VolunteerReviewFormProps {
  volunteerId: string;
  volunteerName: string;
  eventId: string;
  onReviewSubmitted?: () => void;
}

const VolunteerReviewForm = ({ volunteerId, volunteerName, eventId, onReviewSubmitted }: VolunteerReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Błąd',
        description: 'Proszę wybrać ocenę',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock submission — replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Sukces!',
        description: 'Opinia została wysłana',
      });

      // Call the callback to hide the form
      onReviewSubmitted?.();
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się wysłać opinii',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Wystaw opinię dla: {volunteerName}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Twoja opinia pomoże innym organizatorom
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Ocena
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Komentarz (opcjonalnie)
            </label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Opisz swoje doświadczenie współpracy z wolontariuszem..."
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 znaków
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij opinię'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VolunteerReviewForm;