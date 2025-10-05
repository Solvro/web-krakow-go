import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ThumbsUp, Leaf, Users } from 'lucide-react';
import { FeedPost } from '@/data/mockFeedPosts';
import { useState } from 'react';

interface FeedPostCardProps {
  post: FeedPost;
}

const FeedPostCard = ({ post }: FeedPostCardProps) => {
  const [congratulated, setCongratulated] = useState(post.congratulated);
  const [likes, setLikes] = useState(post.likes);

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'animals':
        return <Heart className="w-6 h-6" />;
      case 'eco':
        return <Leaf className="w-6 h-6" />;
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  const handleCongratulate = () => {
    if (!congratulated) {
      setCongratulated(true);
      setLikes(likes + 1);
    }
  };

  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={post.userAvatar} alt={post.userName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {post.userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-bold text-foreground">{post.userName}</h3>
          <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <p className="flex-1 text-foreground text-base">
          {post.achievement}
        </p>
        {post.image && (
          <div className="relative">
            <img
              src={post.image}
              alt="Achievement"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="absolute -bottom-3 -right-3 bg-primary rounded-full p-3 text-primary-foreground">
              {getBadgeIcon(post.badgeCategory)}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          onClick={handleCongratulate}
          variant={congratulated ? "default" : "outline"}
          size="lg"
          className="gap-2"
        >
          <ThumbsUp className="w-4 h-4" />
          {congratulated ? 'POGRATULOWANO' : 'POGRATULUJ'}
        </Button>
        <div className="flex items-center gap-2 text-destructive">
          <span className="text-lg font-semibold">{likes}</span>
          <Heart className="w-5 h-5 fill-current" />
        </div>
      </div>
    </Card>
  );
};

export default FeedPostCard;
