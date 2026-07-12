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

  return (
    <div className={frameClass}>
      <div className="media-frame-inner">
        {video ? (
          <>
            <LoopVideo
              src={video}
              poster={image}
              className="media-video hidden md:block"
              aria-label={alt}
            />
            {mobileVideo ? (
              <LoopVideo
                src={mobileVideo}
                poster={mobileImage}
                className="media-video md:hidden"
                aria-label={alt}
              />
            ) : (
              <Image
                src={mobileImage}
                alt={alt}
                fill
                className="media-image md:hidden"
                sizes="100vw"
              />
            )}
          </>
        ) : (
          <>
            <Image
              src={mobileImage}
              alt={alt}
              fill
              className="media-image md:hidden"
              sizes="100vw"
              priority={variant === "hero"}
            />
            <Image
              src={image}
              alt={alt}
              fill
              className="media-image hidden md:block"
              sizes={variant === "hero" ? "58vw" : "50vw"}
              priority={variant === "hero"}
            />
          </>
        )}
        <div className="media-grain" aria-hidden="true" />
      </div>
      <div className="bauhaus-mark" aria-hidden="true" />
      {variant === "hero" ? (
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
