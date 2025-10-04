interface EventTitleProps {
  title: string;
}

export const EventTitle = ({ title }: EventTitleProps) => {
  return (
    <h3 className="text-lg font-bold text-foreground mb-1">
      {title}
    </h3>
  );
};
