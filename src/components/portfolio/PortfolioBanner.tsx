"use client";

import { useEffect, useRef } from "react";

type PortfolioBannerProps = {
  name: string;
  role: string;
  image: string;
  video: string;
  alt: string;
};

function videoType(src: string) {
  return /\.webm(\?|$)/i.test(src) ? "video/webm" : "video/mp4";
}

export function PortfolioBanner({ name, role, image, video, alt }: PortfolioBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasMedia = Boolean(video || image);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      node.pause();
      return;
    }
    node.play().catch(() => {
      /* autoplay blocked; the still image stays in place */
    });
  }, [video]);

  return (
    <section className={hasMedia ? "portfolio-banner has-media" : "portfolio-banner"}>
      {hasMedia ? (
        <div className="portfolio-banner-media">
          {image ? (
            // The still keeps the uploaded frame. Reduced motion shows this instead of the film.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={video ? "" : alt || ""} />
          ) : null}
          {video ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={image || undefined}
              aria-label={alt || undefined}
            >
              <source src={video} type={videoType(video)} />
            </video>
          ) : null}
          <div className="portfolio-banner-scrim" />
        </div>
      ) : null}
      <div className="portfolio-banner-copy">
        <p className="portfolio-role">{role}</p>
        <h1 className="portfolio-name">{name}</h1>
      </div>
    </section>
  );
}
