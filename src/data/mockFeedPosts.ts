import avatarAnna from '@/assets/avatar-anna.png';

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timeAgo: string;
  achievement: string;
  image?: string;
  badgeCategory: 'animals' | 'eco' | 'organization';
  congratulated: boolean;
  likes: number;
}

export const mockFeedPosts: FeedPost[] = [
  {
    id: 'feed-1',
    userId: '1',
    userName: 'Ania',
    userAvatar: avatarAnna,
    timeAgo: '2 godziny temu',
    achievement: 'Ania właśnie ukończyła 5 godzin pracy w schronisku!',
    image: 'https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=400',
    badgeCategory: 'animals',
    congratulated: true,
    likes: 13,
  },
  {
    id: 'feed-2',
    userId: '2',
    userName: 'Jan',
    userAvatar: undefined,
    timeAgo: 'Wczoraj',
    achievement: 'Jan właśnie zdobył odznakę Eko-Bohater!',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    badgeCategory: 'eco',
    congratulated: false,
    likes: 25,
  },
  {
    id: 'feed-3',
    userId: '3',
    userName: 'Kasia',
    userAvatar: undefined,
    timeAgo: '3 dni temu',
    achievement: 'Kasia ukończyła organizację festynu charytatywnego!',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
    badgeCategory: 'organization',
    congratulated: true,
    likes: 42,
  },
  {
    id: 'feed-4',
    userId: '4',
    userName: 'Michał',
    userAvatar: undefined,
    timeAgo: '5 dni temu',
    achievement: 'Michał zdobył odznakę Pomocna Łapa za wolontariat w schronisku!',
    image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=400',
    badgeCategory: 'animals',
    congratulated: false,
    likes: 18,
  },
  {
    id: 'feed-5',
    userId: '5',
    userName: 'Zosia',
    userAvatar: undefined,
    timeAgo: 'Tydzień temu',
    achievement: 'Zosia ukończyła 20 godzin pracy przy zbiórce odpadów!',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    badgeCategory: 'eco',
    congratulated: true,
    likes: 31,
  },
];
