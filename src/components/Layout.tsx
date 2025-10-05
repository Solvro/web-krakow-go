import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import krakowGoLogo from '@/assets/krakow-go-logo.png';
import mlodyKrakowLogo from '@/assets/mlody-krakow-logo.png';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  showBottomNav?: boolean;
}

const Layout = ({ 
  children, 
  title, 
  showBackButton = false, 
  showBottomNav = true 
}: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          {title ? (
            <h1 className={`font-semibold text-foreground flex-1 ${!showBackButton ? 'text-2xl font-bold' : 'text-lg'}`}>
              {title}
            </h1>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-3">
              <img src={krakowGoLogo} alt="Krakow Go" className={`object-contain ${!showBackButton ? 'h-12' : 'h-10'}`} />
              <span className={`font-bold text-muted-foreground ${!showBackButton ? 'text-2xl' : 'text-xl'}`}>×</span>
              <img src={mlodyKrakowLogo} alt="Młody Kraków" className={`object-contain ${!showBackButton ? 'h-12' : 'h-10'}`} />
            </div>
          )}
        </div>
      </header>

      {children}

      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
