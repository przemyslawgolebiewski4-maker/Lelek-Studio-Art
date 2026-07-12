import type { ElementItem } from "@/types/content";

export function HomeElements({ items }: { items: ElementItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section-pad border-t border-sand bg-sand/10">
      <div className="container">
        <p className="eyebrow mb-8">The elements</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.number} className="border border-ink/10 bg-cream p-6">
              <p className="cat-num">{item.number}</p>
              <p className="mt-3 font-serif text-2xl text-ink">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
