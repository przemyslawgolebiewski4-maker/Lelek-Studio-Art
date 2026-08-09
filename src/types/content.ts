export interface JournalPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  coverImage: string;
  /** SEO/accessibility alt for the cover image - editable in admin, not derived from title alone. */
  coverImageAlt?: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type JournalPostSummary = Omit<JournalPost, "body">;

export interface HomeSectionContent {
  [key: string]: unknown;
}

export interface GalleryImage {
  image: string;
  alt: string;
}

export interface StorySection {
  eyebrow?: string;
  heading?: string;
  headingEm?: string;
  body1?: string;
  body2?: string;
  body3?: string;
  signature?: string;
  image?: string;
  imageMobile?: string;
  video?: string;
  videoMobile?: string;
  imageAlt?: string;
  imageCaption?: string;
  /** About page sculpture / originals photo gallery */
  gallery?: GalleryImage[];
  /** About CTA labels (hrefs are env/fixed) */
  ctaShopLabel?: string;
  ctaTradeLabel?: string;
}

export interface ArchitectsSection {
  eyebrow?: string;
  headline?: string;
  headlineEm?: string;
  sub?: string;
  point1Title?: string;
  point1Body?: string;
  point2Title?: string;
  point2Body?: string;
  point3Title?: string;
  point3Body?: string;
  ctaText?: string;
  formTitle?: string;
  formSuccessTitle?: string;
  formSuccessBody?: string;
  /** Trade page hero media */
  heroImage?: string;
  heroImageMobile?: string;
  heroVideo?: string;
  heroVideoMobile?: string;
  heroImageAlt?: string;
  heroCaption?: string;
}

export interface JournalSection {
  eyebrow?: string;
  heading?: string;
  headingEm?: string;
  sub?: string;
}

export interface ElementItem {
  number: string;
  name: string;
}

export interface ElementsSection {
  items?: ElementItem[];
  /** One-line note above the Earth/Water/Fire/Air bar */
  scopeNote?: string;
}

export interface SignpostCard {
  label: string;
  description: string;
  href: string;
}

export interface SignpostSection {
  intro?: string;
  tradeSignal?: string;
  tradeHref?: string;
  cards?: SignpostCard[];
}

export interface FeaturedSection {
  eyebrow?: string;
  heading?: string;
  headingEm?: string;
  video?: string;
  videoMobile?: string;
  videoAlt?: string;
}

export interface FindSection {
  studioName?: string;
  studioAddress?: string;
  studioInstagram?: string;
  etsyUrl?: string;
  lelekMeaning?: string;
}
