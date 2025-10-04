import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

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
    <Layout title="Mój Wolontariat">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <p className="text-muted-foreground">Twoje zgłoszenia i aktywny wolontariat</p>
      </div>
    </Layout>
  );
};

export default MyVolunteering;
