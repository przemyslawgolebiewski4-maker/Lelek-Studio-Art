export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="page-shell">
      <div className="sec-eyebrow">Coming soon</div>
      <h1 className="page-h1">{title}</h1>
      <p className="page-intro">{description}</p>
    </section>
  );
}
