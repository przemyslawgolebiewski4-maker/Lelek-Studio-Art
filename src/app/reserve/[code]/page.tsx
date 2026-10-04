import type { Metadata } from "next";
import { SITE_URL, INSTAGRAM_URL, resolveInstagramUrl } from "@/lib/config";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { localeText } from "@/lib/i18n/present";
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
  const [data, locale] = await Promise.all([fetchReserveByCode(code), getLocale()]);

  if (!data) {
    return {
      title: locale === "pl" ? "Nie znaleziono rzeczy" : "Piece not found",
      description:
        locale === "pl"
          ? "Nie udało się znaleźć tej rzeczy z wystawy."
          : "This exhibition piece could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const titleName = localeText(locale, data.title);
  const title = `${titleName} · LELEK`;
  const description =
    localeText(locale, data.description?.trim()) ||
    (locale === "pl"
      ? `${titleName}, na widoku: ${data.locationName}.`
      : `${data.title} — on display at ${data.locationName}.`);
  const image = data.imageUrl?.trim() || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/reserve/${encodeURIComponent(data.catalogCode || code)}`,
      siteName: SITE_NAME,
      images: [{ url: image, alt: titleName }],
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
  const [data, settings, locale] = await Promise.all([
    fetchReserveByCode(code),
    getSiteSettings(),
    getLocale(),
  ]);
  const reserveLang = locale === "pl" ? "pl" : "en";

  const email = settings.email?.trim() || "lelekstudio@lelekstudio.com";
  const instagramUrl = resolveInstagramUrl(settings.instagram) || INSTAGRAM_URL;

  if (!data) {
    return (
      <ReserveShell code={code || "—"} initialLang={reserveLang}>
        <ReserveNotFound code={code} />
      </ReserveShell>
    );
  }

  if (data.exhibitionStatus === "available") {
    return (
      <ReserveShell
        locationName={data.locationName}
        code={data.instanceCode || data.catalogCode || code}
        initialLang={reserveLang}
      >
        <ReserveAvailable data={data} instagramUrl={instagramUrl} />
      </ReserveShell>
    );
  }

  return (
    <ReserveShell
      locationName={data.locationName}
      code={data.instanceCode || data.catalogCode || code}
      initialLang={reserveLang}
    >
      <ReserveUnavailable data={data} instagramUrl={instagramUrl} email={email} />
    </ReserveShell>
  );
}
