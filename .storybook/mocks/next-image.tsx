// Storybook mock — replaces next/image with a plain <img> element
// Needed because @storybook/nextjs-vite's built-in NextImage mock
// is incompatible with Next.js 16

import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  loader?: (p: { src: string; width: number; quality?: number }) => string;
};

function MockImage({ fill, priority, quality, sizes, loader, style, ...rest }: ImageProps) {
  const fillStyle: React.CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : {};

  return <img {...rest} style={{ ...fillStyle, ...style }} />;
}

export default MockImage;
export { MockImage as Image };
