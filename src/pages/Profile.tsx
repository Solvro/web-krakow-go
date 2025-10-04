import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Pencil } from 'lucide-react';
import BadgeCard from '@/components/BadgeCard';
import { mockUserProfile, mockUserVolunteering } from '@/data/mockUserProfile';
import { mockBadges } from '@/data/mockBadges';
import ekoInicjatywa from '@/assets/badges/eko-inicjatywa.png';
import straznikCzystosci from '@/assets/badges/straznik-czystosci.png';
import pomocnaLapa from '@/assets/badges/pomocna-lapa.png';
import adopcyjnyCzarodziej from '@/assets/badges/adopcyjny-czarodziej.png';
import perfekcyjnyPlan from '@/assets/badges/perfekcyjny-plan.png';
import liderZespolu from '@/assets/badges/lider-zespolu.png';
import mistrzLogistyki from '@/assets/badges/mistrz-logistyki.png';

const Profile = () => {
  const badgeImages: { [key: string]: string } = {
    'eko-inicjatywa': ekoInicjatywa,
    'straznik-czystosci': straznikCzystosci,
    'pomocna-lapa': pomocnaLapa,
    'adopcyjny-czarodziej': adopcyjnyCzarodziej,
    'perfekcyjny-plan': perfekcyjnyPlan,
    'lider-zespolu': liderZespolu,
    'mistrz-logistyki': mistrzLogistyki,
  };

  const badgesByCategory = mockBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as { [key: string]: typeof mockBadges });

  return (
    <Layout title="Profil">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-8 pb-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={mockUserProfile.avatar} />
              <AvatarFallback className="bg-orange-200 text-4xl">
                {mockUserProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">{mockUserProfile.name}</h1>
            <p className="text-muted-foreground">{mockUserProfile.age} lata</p>
            <p className="text-muted-foreground">{mockUserProfile.role}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Zainteresowania i umiejętności</h2>
          <p className="text-muted-foreground leading-relaxed">
            {mockUserProfile.skills}
          </p>
        </div>

        {/* Badges Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Odznaki</h2>
          <div className="space-y-6">
            {Object.entries(badgesByCategory).map(([category, badges]) => (
              <div key={category}>
                <h3 className="text-sm font-medium mb-3">{category}</h3>
                <div className="flex gap-4">
                  {badges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      image={badgeImages[badge.image]}
                      title={badge.title}
                      earned={badge.earned}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteering History */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Moje Wolontariaty</h2>
          <div className="space-y-3">
            {mockUserVolunteering.map((volunteering) => (
              <div
                key={volunteering.id}
                className="bg-card rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{volunteering.title}</h3>
                    <p className="text-sm text-muted-foreground">{volunteering.hours}</p>
                  </div>
                </div>
                {volunteering.hasCertificate && (
                  <Button variant="ghost" className="text-primary hover:text-primary">
                    Zaświadczenie
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Podsumowanie</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Przepracowane godziny</p>
              <p className="text-4xl font-bold">{mockUserProfile.totalHours}</p>
            </div>
            <div className="bg-card rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Zdobyte odznaki</p>
              <p className="text-4xl font-bold">{mockUserProfile.totalBadges}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
