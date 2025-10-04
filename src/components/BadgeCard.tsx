interface BadgeCardProps {
  image: string;
  title: string;
  earned: boolean;
}

const BadgeCard = ({ image, title, earned }: BadgeCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <img 
        src={image} 
        alt={title}
        className={`w-16 h-16 ${earned ? 'opacity-100' : 'opacity-30'}`}
      />
      <p className={`text-xs text-center max-w-[80px] ${
        earned ? 'text-muted-foreground' : 'text-muted-foreground/40'
      }`}>
        {title}
      </p>
    </div>
  );
};

export default BadgeCard;
