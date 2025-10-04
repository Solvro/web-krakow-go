import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const EventCard = ({ children, onClick, className }: EventCardProps) => {
  return (
    <Card 
      className={cn(
        "p-5 bg-card border-border hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </Card>
  );
};
