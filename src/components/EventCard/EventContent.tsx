import { ReactNode } from 'react';

interface EventContentProps {
  children: ReactNode;
}

export const EventContent = ({ children }: EventContentProps) => {
  return (
    <div className="flex-1">
      {children}
    </div>
  );
};
