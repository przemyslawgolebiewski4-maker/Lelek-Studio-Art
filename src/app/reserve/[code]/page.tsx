import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site";
import { fetchReserveByCode } from "@/lib/reserve";
import {
  ReserveAvailable,
  ReserveNotFound,
  ReserveShell,
  ReserveUnavailable,
} from "@/components/public/ReserveView";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const data = await fetchReserveByCode(code);

  if (!data) {
    return {
      title: "Piece not found",
      description: "This exhibition piece could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${data.title} · LELEK`;
  const description =
    data.description?.trim() ||
    `${data.title} — on display at ${data.locationName}.`;
  const image = data.imageUrl?.trim() || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/reserve/${encodeURIComponent(data.catalogCode || code)}`,
      siteName: SITE_NAME,
      images: [{ url: image, alt: data.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: false, follow: false },
  };
}

export default async function ReservePage({ params }: PageProps) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || "").trim();
  const [data, settings] = await Promise.all([
    fetchReserveByCode(code),
    getSiteSettings(),
  ]);

  const email = settings.email?.trim() || "lelekstudio@lelekstudio.com";
  const instagramUrl =
    settings.instagram?.trim() ||
    "https://www.instagram.com/lelek.studio.berlin/";

  if (!data) {
    return (
      <ReserveShell code={code || "—"}>
        <ReserveNotFound code={code} />
      </ReserveShell>
    );
  }

  if (data.exhibitionStatus === "available") {
    return (
      <ReserveShell
        locationName={data.locationName}
        code={data.instanceCode || data.catalogCode || code}
      >
        <ReserveAvailable data={data} />
      </ReserveShell>
    );
  }

  return (
    <ReserveShell
      locationName={data.locationName}
      code={data.instanceCode || data.catalogCode || code}
    >
      <ReserveUnavailable data={data} instagramUrl={instagramUrl} email={email} />
    </ReserveShell>
  );
}
