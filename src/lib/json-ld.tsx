type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Inject JSON-LD for structured data (Organization, Person, VisualArtwork, BreadcrumbList). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
