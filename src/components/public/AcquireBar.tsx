import Link from "next/link";

type AcquireBarProps = {
  etsyUrl?: string;
  label?: string;
};

export function AcquireBar({
  etsyUrl = "https://www.etsy.com/shop/LelekStudio",
  label = "Enter shop",
}: AcquireBarProps) {
  return (
    <div className="acquire-bar">
      <Link
        href={etsyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="acquire-link"
      >
        {label} <span>↗</span>
      </Link>
    </div>
  );
}
