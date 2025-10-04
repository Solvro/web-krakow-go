import { useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { 
  EventCard, 
  EventHeader, 
  EventContent, 
  EventTitle, 
  EventDescription, 
  EventInfoList, 
  EventInfo, 
  EventBadge 
} from '@/components/EventCard';

export interface VolunteerOffer {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  dateLabel: string;
  dateType: 'today' | 'tomorrow' | 'future';
  date?: string;
  organizer?: string;
}

interface VolunteerCardProps {
  offer: VolunteerOffer;
}

const VolunteerCard = ({ offer }: VolunteerCardProps) => {
  const navigate = useNavigate();
  
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'today':
        return 'default';
      case 'tomorrow':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <EventCard onClick={() => navigate(`/oferta/${offer.id}`)}>
      <EventHeader>
        <EventContent>
          <EventTitle title={offer.title} />
        </EventContent>
        <EventBadge label={offer.dateLabel} variant={getBadgeVariant(offer.dateType)} />
      </EventHeader>
      
      <EventDescription description={offer.description} />
      
      <EventInfoList>
        <EventInfo icon={MapPin} text={offer.location} />
        <EventInfo icon={Clock} text={offer.time} />
      </EventInfoList>
    </EventCard>
  );
};

export default VolunteerCard;
