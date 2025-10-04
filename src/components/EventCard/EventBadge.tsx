import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventBadgeProps {
  label: string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export const EventBadge = ({ label, variant = 'default', className }: EventBadgeProps) => {
  return (
    <Badge variant={variant} className={cn("ml-2", className)}>
      {label}
    </Badge>
  );
};
