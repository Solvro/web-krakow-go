export type ApplicationStatus = 'accepted' | 'pending' | 'rejected' | 'completed';

export interface VolunteerApplication {
  id: string;
  offerId: string;
  title: string;
  organizer: string;
  date: string;
  status: ApplicationStatus;
}

export const mockApplications: VolunteerApplication[] = [
  {
    id: 'app-1',
    offerId: '1',
    title: 'Pomoc w organizacji festynu',
    organizer: 'Fundacja Dzieciom',
    date: '15 czerwca 2024 - 16 czerwca 2024',
    status: 'accepted',
  },
  {
    id: 'app-2',
    offerId: '2',
    title: 'Zbiórka darów dla schroniska',
    organizer: 'Schronisko dla zwierząt "Azyl"',
    date: '20 lipca 2024',
    status: 'pending',
  },
  {
    id: 'app-3',
    offerId: '3',
    title: 'Malowanie muralu na osiedlu',
    organizer: 'Stowarzyszenie "Kolorowy Kraków"',
    date: '1 maja 2024 - 5 maja 2024',
    status: 'completed',
  },
  {
    id: 'app-4',
    offerId: '4',
    title: 'Pomoc przy maratonie',
    organizer: 'Urząd Miasta Krakowa',
    date: '22 kwietnia 2024',
    status: 'completed',
  },
];
