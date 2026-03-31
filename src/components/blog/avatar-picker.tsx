"use client";

import { cn } from "@/lib/utils";
import { AVATAR_PRESETS, type AvatarPreset } from "@/lib/validators";

const AVATAR_LABELS: Record<AvatarPreset, string> = {
  "avatar-cat": "🐱",
  "avatar-dog": "🐶",
  "avatar-fox": "🦊",
  "avatar-owl": "🦉",
  "avatar-bear": "🐻",
  "avatar-rabbit": "🐰",
  "avatar-panda": "🐼",
  "avatar-koala": "🐨",
};

interface AvatarPickerProps {
  selected: AvatarPreset;
  onSelect: (avatar: AvatarPreset) => void;
  className?: string;
}

export function AvatarPicker({ selected, onSelect, className }: AvatarPickerProps) {
  return (
    <fieldset className={cn("flex flex-col gap-2 border-none p-0", className)}>
      <legend className="text-sm font-medium">Choose an Avatar</legend>
      <div role="radiogroup" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {AVATAR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            role="radio"
            aria-checked={selected === preset}
            aria-label={`Select ${preset.replace("avatar-", "")} avatar`}
            onClick={() => {
              onSelect(preset);
            }}
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-lg transition-colors",
              selected === preset
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-accent",
            )}
          >
            {AVATAR_LABELS[preset]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function avatarEmoji(preset: string): string {
  if (preset in AVATAR_LABELS) {
    return AVATAR_LABELS[preset as AvatarPreset];
  }
  return "👤";
}
