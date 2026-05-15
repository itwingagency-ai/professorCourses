"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeCourseImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const FALLBACK_IMAGE = "https://res.cloudinary.com/dmnwypzze/image/upload/v1698206512/course_placeholder.jpg";

function isLocalImage(src: string) {
  return src.startsWith("/");
}

function isAllowedRemoteImage(src: string) {
  try {
    const url = new URL(src);
    return [
      "picsum.photos",
      "res.cloudinary.com",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "avatars.githubusercontent.com",
    ].includes(url.hostname);
  } catch {
    return false;
  }
}

export default function SafeCourseImage({
  src,
  alt = "Course image",
  className = "",
  width = 800,
  height = 600,
  priority = false,
}: SafeCourseImageProps) {
  const [hasError, setHasError] = useState(false);

  const finalSrc =
    !src || hasError
      ? FALLBACK_IMAGE
      : isLocalImage(src) || isAllowedRemoteImage(src)
        ? src
        : FALLBACK_IMAGE;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
