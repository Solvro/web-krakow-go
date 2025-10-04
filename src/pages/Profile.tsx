import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profil' } } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Profil">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <p className="text-muted-foreground">Ustawienia profilu użytkownika</p>
      </div>
    </Layout>
  );
};

export default Profile;
