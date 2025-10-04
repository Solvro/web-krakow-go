interface EventOrganizerProps {
  organizer: string;
}

export const EventOrganizer = ({ organizer }: EventOrganizerProps) => {
  return (
    <p className="text-muted-foreground text-sm">
      {organizer}
    </p>
  );
};
