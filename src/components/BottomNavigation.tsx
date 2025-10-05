import { Search, HandHeart, User, MessageCircle, Newspaper } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'offers',
      label: 'Oferty',
      icon: Search,
      path: '/',
    },
    {
      id: 'volunteering',
      label: 'Wolontariat',
      icon: HandHeart,
      path: '/moj-wolontariat',
    },
    {
      id: 'feed',
      label: 'Feed',
      icon: Newspaper,
      path: '/feed',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      path: '/profil/vol-ania',
    },
    {
      id: 'chats',
      label: 'Czaty',
      icon: MessageCircle,
      path: '/czaty',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/oferta/');
    }
    if (path === '/czaty') {
      return location.pathname === '/czaty' || location.pathname.startsWith('/czaty/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-5 h-16 max-w-3xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'} whitespace-nowrap`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
