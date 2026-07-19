"use client";

import { useEffect, useRef } from "react";

type LoopVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  "aria-label"?: string;
};

export function LoopVideo({ src, poster, className, "aria-label": ariaLabel }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      /* autoplay blocked - poster remains visible */
    });
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={ariaLabel}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
