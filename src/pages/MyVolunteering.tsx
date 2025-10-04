import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';

const MyVolunteering = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/moj-wolontariat' } } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg font-semibold text-foreground">Mój Wolontariat</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <p className="text-muted-foreground">Twoje zgłoszenia i aktywny wolontariat</p>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyVolunteering;
