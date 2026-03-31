import { Avatar, AvatarText } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { avatarEmoji } from "./avatar-picker";

interface CommentItemProps {
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  onReply?: () => void;
  className?: string;
}

export function CommentItem({
  authorName,
  authorAvatar,
  timeAgo,
  content,
  onReply,
  className,
}: CommentItemProps) {
  return (
    <div className={cn("flex gap-3 py-4", className)}>
      <Avatar className="size-8 shrink-0">
        <AvatarText>{avatarEmoji(authorAvatar)}</AvatarText>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{authorName}</span>
          <span className="text-muted-foreground text-xs">{timeAgo}</span>
        </div>

        <p className="text-muted-foreground mt-1 text-sm">{content}</p>

        {onReply && (
          <button
            onClick={onReply}
            className="text-muted-foreground hover:text-foreground mt-1 text-xs font-medium"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}
