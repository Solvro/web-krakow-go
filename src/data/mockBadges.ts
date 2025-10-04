export interface Badge {
  id: string;
  title: string;
  category: string;
  image: string;
  earned: boolean;
}

export const mockBadges: Badge[] = [
  // Eko-Bohater
  {
    id: '1',
    title: 'Eko Inicjatywa',
    category: 'Eko-Bohater',
    image: 'eko-inicjatywa',
    earned: true,
  },
  {
    id: '2',
    title: 'Strażnik Czystości',
    category: 'Eko-Bohater',
    image: 'straznik-czystosci',
    earned: false,
  },
  // Przyjaciel Zwierząt
  {
    id: '3',
    title: 'Pomocna Łapa',
    category: 'Przyjaciel Zwierząt',
    image: 'pomocna-lapa',
    earned: true,
  },
  {
    id: '4',
    title: 'Adopcyjny Czarodziej',
    category: 'Przyjaciel Zwierząt',
    image: 'adopcyjny-czarodziej',
    earned: false,
  },
  // Mistrz Organizacji
  {
    id: '5',
    title: 'Perfekcyjny Plan',
    category: 'Mistrz Organizacji',
    image: 'perfekcyjny-plan',
    earned: true,
  },
  {
    id: '6',
    title: 'Lider Zespołu',
    category: 'Mistrz Organizacji',
    image: 'lider-zespolu',
    earned: false,
  },
  {
    id: '7',
    title: 'Mistrz Logistyki',
    category: 'Mistrz Organizacji',
    image: 'mistrz-logistyki',
    earned: false,
  },
];
