interface EventDescriptionProps {
  description: string;
}

export const EventDescription = ({ description }: EventDescriptionProps) => {
  return (
    <p className="text-muted-foreground text-sm mb-3">
      {description}
    </p>
  );
};
