import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/mlody-krakow-logo.png';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'volunteer' | 'coordinator'>('volunteer');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Zalogowano pomyślnie!",
          description: "Witaj z powrotem.",
        });
      } else {
        await register(email, password, name);
        toast({
          title: "Konto utworzone!",
          description: "Możesz teraz zgłaszać się do wydarzeń.",
        });
      }
      
      // Navigate based on user type
      if (userType === 'coordinator') {
        navigate('/koordynator', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Coś poszło nie tak. Spróbuj ponownie.",
        variant: "destructive",
      });
    }
  };

  const handleQuickLogin = (type: 'volunteer' | 'coordinator') => {
    if (type === 'coordinator') {
      setEmail('koordynator@szkola.pl');
      setUserType('coordinator');
    } else {
      setEmail('wolontariusz@example.com');
      setUserType('volunteer');
    }
    setPassword('demo123');
    toast({
      title: "Demo",
      description: `Wypełniono dane dla ${type === 'coordinator' ? 'koordynatora' : 'wolontariusza'}`,
    });
  };

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
          <img src={logo} alt="Młody Kraków" className="h-8 object-contain" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-2">
              {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Imię i nazwisko
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jan Kowalski"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="h-14"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Adres e-mail lub nazwa użytkownika
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Hasło
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14"
              />
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Nie pamiętam hasła?
                  </button>
                </div>
              )}
            </div>

            <Button 
              type="submit"
              className="w-full h-14 text-lg font-semibold rounded-xl"
              size="lg"
            >
              {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
            </Button>

            {isLogin && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">
                      Szybkie logowanie DEMO
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14"
                    onClick={() => handleQuickLogin('volunteer')}
                  >
                    Wolontariusz
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14"
                    onClick={() => handleQuickLogin('coordinator')}
                  >
                    Koordynator
                  </Button>
                </div>
              </>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  Lub zaloguj się przez
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-14 gap-2"
                onClick={() => toast({ title: "Demo", description: "Logowanie przez Google niedostępne w wersji demo." })}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-14 gap-2"
                onClick={() => toast({ title: "Demo", description: "Logowanie przez Facebook niedostępne w wersji demo." })}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? 'Nie masz konta? ' : 'Masz już konto? '}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
