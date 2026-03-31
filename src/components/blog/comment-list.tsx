"use client";

import { useState } from "react";

import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface ReplyData {
  id: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Date;
}

interface CommentData {
  id: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Date;
  replies: ReplyData[];
}

interface CommentListProps {
  comments: CommentData[];
  postId: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${String(minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${String(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return `${String(days)}d ago`;
}

export function CommentList({ comments, postId }: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <div key={comment.id} className="border-border border-b last:border-b-0">
          <CommentItem
            authorName={comment.authorName}
            authorAvatar={comment.authorAvatar}
            timeAgo={timeAgo(comment.createdAt)}
            content={comment.content}
            onReply={() => {
              setReplyingTo(replyingTo === comment.id ? null : comment.id);
            }}
          />

          {/* Nested replies */}
          {comment.replies.length > 0 && (
            <div className="ml-11 flex flex-col">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  authorName={reply.authorName}
                  authorAvatar={reply.authorAvatar}
                  timeAgo={timeAgo(reply.createdAt)}
                  content={reply.content}
                />
              ))}
            </div>
          )}

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="ml-11 pb-4">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCancel={() => {
                  setReplyingTo(null);
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
