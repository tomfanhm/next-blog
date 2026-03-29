import { CommentCard } from "@/components/comment-card";
import { CommentForm } from "@/components/comment-form";
import { Separator } from "@/components/ui/separator";
import type { Comment } from "@/generated/prisma/browser";

interface CommentWithReplies extends Comment {
  replies: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: CommentWithReplies[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const totalCount = comments.reduce((n, c) => n + 1 + c.replies.length, 0);

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-foreground text-xl font-semibold">
        {totalCount} {totalCount === 1 ? "Comment" : "Comments"}
      </h2>

      <Separator />

      <CommentForm postId={postId} />

      <Separator />

      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} postId={postId} />
        ))}
        {comments.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </section>
  );
}
