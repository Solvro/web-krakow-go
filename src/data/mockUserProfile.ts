import avatarAnna from '@/assets/avatar-anna.png';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  role: string;
  skills: string;
  totalHours: number;
  totalBadges: number;
  avatar?: string;
}

export interface UserVolunteering {
  id: string;
  title: string;
  hours: string;
  date: string;
  hasCertificate: boolean;
}

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Anna Kowalska',
  age: 22,
  role: 'Studentka psychologii',
  skills: 'Pomoc dzieciom, organizacja wydarzeń, komunikacja interpersonalna, praca zespołowa',
  totalHours: 45,
  totalBadges: 3,
  avatar: avatarAnna,
};

export const mockUserVolunteering: UserVolunteering[] = [
  {
    id: '1',
    title: 'Festiwal Kultury Studenckiej',
    hours: '15 godzin',
    date: '2024-03-15',
    hasCertificate: true,
  },
  {
    id: '2',
    title: 'Maraton Charytatywny',
    hours: '20 godzin',
    date: '2024-02-20',
    hasCertificate: true,
  },
  {
    id: '3',
    title: 'Dni Seniora',
    hours: '10 godzin',
    date: '2024-01-10',
    hasCertificate: true,
  },
];
