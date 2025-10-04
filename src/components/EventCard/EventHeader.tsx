import { ReactNode } from 'react';

interface EventHeaderProps {
  children: ReactNode;
}

export const EventHeader = ({ children }: EventHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-3">
      {children}
    </div>
  );
};
