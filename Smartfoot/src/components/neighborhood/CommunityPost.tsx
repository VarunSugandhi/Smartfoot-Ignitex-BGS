
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share } from "lucide-react";

interface CommunityPostProps {
  author: string;
  content: string;
  avatar: string;
  time: string;
  likes: number;
  comments: number;
}

export function CommunityPost({ author, content, avatar, time, likes, comments }: CommunityPostProps) {
  const { toast } = useToast();

  const handleLike = () => {
    toast({
      title: "Post liked!",
      description: "You have liked this post.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied!",
      description: "Link has been copied to your clipboard.",
    });
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage src={avatar} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{author}</h3>
            <span className="text-sm text-gray-500">{time}</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{content}</p>
          <div className="flex items-center space-x-4 mt-4">
            <Button variant="ghost" size="sm" onClick={handleLike} className="gap-2">
              <Heart className="h-4 w-4" />
              {likes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {comments}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
