interface AdPlaceholderProps {
  size: "728x90" | "300x250";
  label?: string;
}

export function AdPlaceholder({ size, label }: AdPlaceholderProps) {
  const [, height] = size.split("x").map(Number) as [number, number];
  const defaultLabel = `Ad Unit [${size}]`;

  return (
    <div
      className="flex items-center justify-center rounded-lg border-2 border-blue-500 bg-blue-100"
      style={{ height }}
    >
      <span className="text-xs font-semibold text-blue-500">{label ?? defaultLabel}</span>
    </div>
  );
}
