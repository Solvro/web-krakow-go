import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockOffers } from '@/data/mockOffers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  motivation: z.string().min(10, { message: 'Uzasadnienie musi mieć co najmniej 10 znaków' }),
  availability: z.string().min(3, { message: 'Podaj swoją dostępność' }),
  experience: z.string().min(10, { message: 'Opisz swoje doświadczenie (min. 10 znaków)' }),
  customAnswer: z.string().optional(),
});

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const offer = mockOffers.find(o => o.id === id);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motivation: '',
      availability: '',
      experience: '',
      customAnswer: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Zgłoszenie:', values);
    toast({
      title: "Zgłoszenie wysłane!",
      description: "Twoje zgłoszenie zostało pomyślnie przesłane do organizatora.",
    });
    setTimeout(() => navigate(-1), 1500);
  };

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nie znaleziono oferty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Formularz zgłoszeniowy</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          {/* Title and Description */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {offer.title}
            </h2>
            <p className="text-muted-foreground text-base">
              Wypełnij formularz, aby zgłosić swoją kandydaturę na to stanowisko.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Motivation */}
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Uzasadnienie chęci udziału <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Dlaczego chcesz wziąć udział w tym wolontariacie?"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Availability */}
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Dostępność <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="np. preferowane dni, godziny"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Doświadczenie i umiejętności <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Opisz swoje doświadczenie lub umiejętności, które mogą być przydatne."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Question from Organizer */}
              <FormField
                control={form.control}
                name="customAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Pytanie od organizatora
                    </FormLabel>
                    <p className="text-sm text-muted-foreground mb-2">
                      Czy posiadasz doświadczenie w obsłudze klienta?
                    </p>
                    <FormControl>
                      <Textarea 
                        placeholder="Twoja odpowiedź..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-6">
        <div className="max-w-3xl mx-auto">
          <Button 
            className="w-full h-14 text-lg font-semibold rounded-xl"
            size="lg"
            onClick={form.handleSubmit(onSubmit)}
          >
            Wyślij zgłoszenie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
