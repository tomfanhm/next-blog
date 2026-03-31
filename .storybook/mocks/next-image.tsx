/* eslint-disable @next/next/no-img-element */
import type { ImageProps } from "next/image";

/**
 * Mock for next/image that renders a plain <img> in Storybook.
 */
export default function MockImage({ src, alt, fill, ...props }: ImageProps) {
  const style: React.CSSProperties = fill
    ? { objectFit: "cover", width: "100%", height: "100%" }
    : {};

  return (
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt}
      style={style}
      {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
}
