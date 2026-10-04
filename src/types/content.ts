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
  i18n?: {
    pl?: {
      title?: string;
      excerpt?: string;
      body?: string;
      coverImageAlt?: string;
      metaTitle?: string;
      metaDescription?: string;
    };
  };
}

export type JournalPostSummary = Omit<JournalPost, "body">;

export interface HomeSectionContent {
  [key: string]: unknown;
}

export interface GalleryImage {
  image: string;
  alt: string;
  altPl?: string;
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
  /** Originals section chrome on /about (product cards come from Products flagged isOriginal) */
  originalsEyebrow?: string;
  originalsHeading?: string;
  originalsIntro?: string;
}

export interface ArchitectsPoint {
  title: string;
  body: string;
  titlePl?: string;
  bodyPl?: string;
}

/** /for-architects — editable in Admin → Homepage → For architects */
export interface ArchitectsSection {
  /** Hero */
  eyebrow?: string;
  headline?: string;
  /** Short line under the headline */
  dek?: string;
  heroBody?: string;
  intro?: string;
  heroImage?: string;
  heroImageMobile?: string;
  heroVideo?: string;
  heroVideoMobile?: string;
  heroImageAlt?: string;
  /** Honest caption. Studio arrangements must not read as client projects. */
  heroCaption?: string;

  /** Existing works and commissions */
  collabHeadline?: string;
  collabHeadlineEm?: string;
  collabBody1?: string;
  collabBody2?: string;
  collabBody3?: string;
  collabBody4?: string;
  /** Commission is not open-ended — it has to fit the practice. */
  collabNote?: string;
  existingImage?: string;
  existingImageAlt?: string;
  existingCaption?: string;
  processImage?: string;
  processImageAlt?: string;
  processCaption?: string;

  /** Numbered kinds of work */
  kindsEyebrow?: string;
  points?: ArchitectsPoint[];

  /** Low-threshold invitation */
  inviteHeadline?: string;
  inviteBody1?: string;
  inviteBody2?: string;
  inviteSignoff?: string;

  /** Inquiry */
  formEyebrow?: string;
  formIntro?: string;
  formCta?: string;
  formEmail?: string;
  formSuccessTitle?: string;
  formSuccessBody?: string;

  /** Legacy keys kept so older documents and the unused homepage block still resolve */
  headlineEm?: string;
  sub?: string;
  point1Title?: string;
  point1Body?: string;
  point2Title?: string;
  point2Body?: string;
  point3Title?: string;
  point3Body?: string;
  closingNote?: string;
  ctaText?: string;
  formTitle?: string;
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
  namePl?: string;
  /** Optional short description under the element name */
  description?: string;
  descriptionPl?: string;
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
  labelPl?: string;
  descriptionPl?: string;
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
  studioInstagramUrl?: string;
  openDaysNote?: string;
  onlineHeading?: string;
  onlineDescription?: string;
  onlineCtaLabel?: string;
  etsyUrl?: string;
  lelekMeaning?: string;
}

export interface ContactSection {
  headingLine1?: string;
  headingLine2?: string;
  headingLine3?: string;
  sub?: string;
  successMessage?: string;
  formNote?: string;
}
