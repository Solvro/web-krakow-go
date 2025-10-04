import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EventInfoProps {
  icon: LucideIcon;
  text: string;
}

export const EventInfo = ({ icon: Icon, text }: EventInfoProps) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{text}</span>
    </div>
  );
};

interface EventInfoListProps {
  children: ReactNode;
}

export const EventInfoList = ({ children }: EventInfoListProps) => {
  return (
    <div className="space-y-2">
      {children}
    </div>
  );
};
