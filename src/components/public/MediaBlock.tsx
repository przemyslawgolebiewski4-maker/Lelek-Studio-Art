import Image from "next/image";
import { LoopVideo } from "@/components/public/LoopVideo";

export type MediaBlockProps = {
  image: string;
  imageMobile?: string;
  video?: string;
  videoMobile?: string;
  alt: string;
  variant?: "hero" | "story";
};

export function MediaBlock({
  image,
  imageMobile,
  video,
  videoMobile,
  alt,
  variant = "hero",
}: MediaBlockProps) {
  const mobileImage = imageMobile ?? image;
  const mobileVideo = videoMobile ?? video;
  const frameClass = variant === "hero" ? "media-frame media-frame-hero" : "media-frame media-frame-story";
  const isHero = variant === "hero";

  return (
    <div className={frameClass}>
      <div className="media-frame-inner">
        {video ? (
          <>
            {/* Poster images are the LCP element; video loads with preload=metadata */}
            <Image
              src={image}
              alt={alt}
              fill
              className="media-image media-poster hidden md:block"
              sizes={isHero ? "58vw" : "50vw"}
              priority={isHero}
            />
            <Image
              src={mobileImage}
              alt={alt}
              fill
              className="media-image media-poster md:hidden"
              sizes="100vw"
              priority={isHero}
            />
            <LoopVideo
              src={video}
              poster={image}
              className="media-video media-video-over hidden md:block"
              aria-label={alt}
            />
            {mobileVideo ? (
              <LoopVideo
                src={mobileVideo}
                poster={mobileImage}
                className="media-video media-video-over md:hidden"
                aria-label={alt}
              />
            ) : null}
          </>
        ) : (
          <>
            <Image
              src={mobileImage}
              alt={alt}
              fill
              className="media-image md:hidden"
              sizes="100vw"
              priority={isHero}
            />
            <Image
              src={image}
              alt={alt}
              fill
              className="media-image hidden md:block"
              sizes={isHero ? "58vw" : "50vw"}
              priority={isHero}
            />
          </>
        )}
        <div className="media-grain" aria-hidden="true" />
      </div>
      <div className="bauhaus-mark" aria-hidden="true" />
      {isHero ? (
        <div className="bauhaus-index" aria-hidden="true">
          00
        </div>
      ) : (
        <div className="bauhaus-index" aria-hidden="true">
          01
        </div>
      )}
    </div>
  );
}
