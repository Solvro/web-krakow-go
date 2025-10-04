import { MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface VolunteerOffer {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  dateLabel: string;
  dateType: 'today' | 'tomorrow' | 'future';
}

interface VolunteerCardProps {
  offer: VolunteerOffer;
}

const VolunteerCard = ({ offer }: VolunteerCardProps) => {
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
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-border">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-foreground">{offer.title}</h3>
        <Badge variant={getBadgeVariant(offer.dateType)} className="ml-2">
          {offer.dateLabel}
        </Badge>
      </div>
      
      <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{offer.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>{offer.time}</span>
        </div>
      </div>
    </Card>
  );
};

export default VolunteerCard;
