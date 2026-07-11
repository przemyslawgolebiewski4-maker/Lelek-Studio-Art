export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="section-pad pt-28">
      <div className="container max-w-2xl">
        <p className="eyebrow mb-3">Coming in next sprint</p>
        <h1 className="text-[var(--text-3xl)]">{title}</h1>
        <p className="mt-4 text-metal">{description}</p>
      </div>
    </section>
  );
}
