export interface JournalPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  coverImage: string;
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
}

export interface ArchitectsSection {
  eyebrow?: string;
  headline?: string;
  sub?: string;
  body?: string;
  ctaText?: string;
  ctaUrl?: string;
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
