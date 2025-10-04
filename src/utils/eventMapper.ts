import { ApiEvent } from '@/services/api';
import { VolunteerOffer } from '@/components/VolunteerCard';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

export const mapEventToVolunteerOffer = (event: ApiEvent): VolunteerOffer => {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  
  // Determine date label and type
  let dateLabel: string;
  let dateType: 'today' | 'tomorrow' | 'future';
  
  if (isToday(startDate)) {
    dateLabel = 'Dziś';
    dateType = 'today';
  } else if (isTomorrow(startDate)) {
    dateLabel = 'Jutro';
    dateType = 'tomorrow';
  } else {
    dateLabel = format(startDate, 'd MMM', { locale: pl });
    dateType = 'future';
  }
  
  // Format time
  const timeStart = format(startDate, 'HH:mm');
  const timeEnd = format(endDate, 'HH:mm');
  const time = `${timeStart} - ${timeEnd}`;
  
  // Format description
  const description = typeof event.description === 'string' 
    ? event.description 
    : event.description?.description || 'Brak opisu';
  
  const location = event.placeName;
  
  return {
    id: event.id,
    title: event.title,
    description,
    location,
    time,
    dateLabel,
    dateType,
    date: event.startDate,
    organizer: event.organizationId, // This will be organization ID for now
  };
};
