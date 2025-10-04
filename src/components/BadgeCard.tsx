interface BadgeCardProps {
  icon: React.ReactNode;
  title: string;
  earned: boolean;
}

const BadgeCard = ({ icon, title, earned }: BadgeCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 flex items-center justify-center rounded-lg ${
        earned ? 'opacity-100' : 'opacity-40'
      }`}>
        {icon}
      </div>
      <p className="text-xs text-center text-muted-foreground max-w-[80px]">
        {title}
      </p>
    </div>
  );
};

export default BadgeCard;
