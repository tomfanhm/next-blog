"use client";

import { useState } from "react";

import { CommentForm } from "@/components/comment-form";
import { Avatar, AvatarText } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Comment } from "@/generated/prisma/browser";

interface CommentWithReplies extends Comment {
  replies?: Comment[];
}

interface CommentCardProps {
  comment: CommentWithReplies;
  postId: string;
  isReply?: boolean;
}

const AVATAR_EMOJIS: Record<string, string> = {
  "avatar-cat": "😺",
  "avatar-dog": "🐶",
  "avatar-fox": "🦊",
  "avatar-owl": "🦉",
  "avatar-bear": "🐻",
  "avatar-rabbit": "🐰",
  "avatar-panda": "🐼",
  "avatar-koala": "🐨",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${String(diffMins)} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${String(diffHours)} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${String(diffDays)} days ago`;
}

export function CommentCard({ comment, postId, isReply = false }: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const emoji = AVATAR_EMOJIS[comment.authorAvatar] ?? "😊";

  return (
    <>
      <div className={isReply ? "pt-3 pl-12" : ""}>
        <div className="flex gap-3">
          <Avatar className={isReply ? "h-8 w-8" : "h-9 w-9"}>
            <AvatarText className="text-base">{emoji}</AvatarText>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">{comment.authorName}</span>
              <span className="text-muted-foreground text-xs">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            <p className="text-foreground text-sm leading-relaxed">{comment.content}</p>

            {!isReply && (
              <button
                onClick={() => {
                  setShowReplyForm((prev) => !prev);
                }}
                className="text-primary w-fit text-xs font-medium hover:underline"
              >
                {showReplyForm ? "Cancel" : "Reply"}
              </button>
            )}
          </div>
        </div>

        {showReplyForm && (
          <div className="mt-3 pl-12">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              compact
              onSuccess={() => {
                setShowReplyForm(false);
              }}
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1">
            {comment.replies.map((reply) => (
              <CommentCard key={reply.id} comment={reply} postId={postId} isReply />
            ))}
          </div>
        )}
      </div>

      {!isReply && <Separator />}
    </>
  );
}
