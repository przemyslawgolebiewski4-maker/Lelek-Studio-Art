import Image from "next/image";
import { LoopVideo } from "@/components/public/LoopVideo";

export type MediaBlockProps = {
  image?: string;
  imageMobile?: string;
  video?: string;
  videoMobile?: string;
  alt: string;
  variant?: "hero" | "story";
};

function mediaUrl(value?: string): string {
  return value?.trim() || "";
}

export function MediaBlock({
  image,
  imageMobile,
  video,
  videoMobile,
  alt,
  variant = "hero",
}: MediaBlockProps) {
  const desktopImage = mediaUrl(image);
  const mobileImage = mediaUrl(imageMobile) || desktopImage;
  const desktopVideo = mediaUrl(video);
  const mobileVideo = mediaUrl(videoMobile) || desktopVideo;
  const frameClass =
    variant === "hero" ? "media-frame media-frame-hero" : "media-frame media-frame-story";
  const isHero = variant === "hero";

  const hasVideo = Boolean(desktopVideo);
  const hasImage = Boolean(desktopImage);

  if (!hasVideo && !hasImage) {
    return (
      <div className={frameClass}>
        <div className="media-frame-inner">
          <div className="media-grain" aria-hidden="true" />
        </div>
        <div className="bauhaus-mark" aria-hidden="true" />
        <div className="bauhaus-index" aria-hidden="true">
          {isHero ? "00" : "01"}
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div className="media-frame-inner">
        {hasVideo ? (
          <>
            {/* Poster only when Admin set a real image - never inject static leftovers */}
            {desktopImage ? (
              <Image
                src={desktopImage}
                alt={alt}
                fill
                className="media-image media-poster hidden md:block"
                sizes={isHero ? "58vw" : "50vw"}
                priority={isHero}
              />
            ) : null}
            {mobileImage ? (
              <Image
                src={mobileImage}
                alt={alt}
                fill
                className="media-image media-poster md:hidden"
                sizes="100vw"
                priority={isHero}
              />
            ) : null}
            <LoopVideo
              src={desktopVideo}
              poster={desktopImage || undefined}
              className="media-video media-video-over hidden md:block"
              aria-label={alt}
            />
            {mobileVideo ? (
              <LoopVideo
                src={mobileVideo}
                poster={mobileImage || undefined}
                className="media-video media-video-over md:hidden"
                aria-label={alt}
              />
            ) : null}
          </>
        ) : (
          <>
            {mobileImage ? (
              <Image
                src={mobileImage}
                alt={alt}
                fill
                className="media-image md:hidden"
                sizes="100vw"
                priority={isHero}
              />
            ) : null}
            {desktopImage ? (
              <Image
                src={desktopImage}
                alt={alt}
                fill
                className="media-image hidden md:block"
                sizes={isHero ? "58vw" : "50vw"}
                priority={isHero}
              />
            ) : null}
          </>
        )}
        <div className="media-grain" aria-hidden="true" />
      </div>
      <div className="bauhaus-mark" aria-hidden="true" />
      <div className="bauhaus-index" aria-hidden="true">
        {isHero ? "00" : "01"}
      </div>
    </div>
  );
}
