export interface Badge {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  earned: boolean;
}

export const mockBadges: Badge[] = [
  // Eko-Bohater
  {
    id: '1',
    title: 'Eko Inicjatywa',
    category: 'Eko-Bohater',
    icon: 'leaf',
    color: 'bg-green-600',
    earned: true,
  },
  {
    id: '2',
    title: 'Strażnik Czystości',
    category: 'Eko-Bohater',
    icon: 'trash-2',
    color: 'bg-green-300',
    earned: true,
  },
  // Przyjaciel Zwierząt
  {
    id: '3',
    title: 'Pomocna Łapa',
    category: 'Przyjaciel Zwierząt',
    icon: 'heart',
    color: 'bg-orange-300',
    earned: true,
  },
  {
    id: '4',
    title: 'Adopcyjny Czarodziej',
    category: 'Przyjaciel Zwierząt',
    icon: 'sparkles',
    color: 'bg-cyan-300',
    earned: false,
  },
  // Mistrz Organizacji
  {
    id: '5',
    title: 'Perfekcyjny Plan',
    category: 'Mistrz Organizacji',
    icon: 'clipboard-check',
    color: 'bg-teal-300',
    earned: false,
  },
  {
    id: '6',
    title: 'Lider Zespołu',
    category: 'Mistrz Organizacji',
    icon: 'users',
    color: 'bg-teal-300',
    earned: false,
  },
  {
    id: '7',
    title: 'Mistrz Logistyki',
    category: 'Mistrz Organizacji',
    icon: 'package',
    color: 'bg-teal-400',
    earned: false,
  },
];
