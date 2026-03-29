"use client";

import { useState } from "react";

import { Avatar, AvatarText } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AVATAR_OPTIONS = [
  { id: "avatar-cat", emoji: "😺" },
  { id: "avatar-dog", emoji: "🐶" },
  { id: "avatar-bear", emoji: "🐻" },
  { id: "avatar-fox", emoji: "🦊" },
  { id: "avatar-rabbit", emoji: "🐰" },
  { id: "avatar-owl", emoji: "🦉" },
  { id: "avatar-panda", emoji: "🐼" },
  { id: "avatar-koala", emoji: "🐨" },
  { id: "emoji-rocket", emoji: "🚀" },
  { id: "emoji-star", emoji: "🌟" },
  { id: "emoji-music", emoji: "🎵" },
  { id: "emoji-plant", emoji: "🌿" },
] as const;

interface AvatarPickerProps {
  name: string;
  defaultValue?: string;
}

export function AvatarPicker({ name, defaultValue }: AvatarPickerProps) {
  const [selected, setSelected] = useState(defaultValue ?? AVATAR_OPTIONS[0].id);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-foreground text-sm font-medium">Choose an Avatar</label>
      <input type="hidden" name={name} value={selected} />

      <div className="flex flex-wrap gap-3">
        {AVATAR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setSelected(opt.id);
            }}
            className="focus:outline-none"
          >
            <Avatar
              className={cn(
                "h-14 w-14 cursor-pointer transition-all",
                selected === opt.id
                  ? "ring-primary ring-offset-background ring-2 ring-offset-2"
                  : "hover:ring-muted-foreground/30 hover:ring-2",
              )}
            >
              <AvatarText className="text-2xl">{opt.emoji}</AvatarText>
            </Avatar>
          </button>
        ))}
      </div>
    </div>
  );
}
