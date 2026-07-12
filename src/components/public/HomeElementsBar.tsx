import type { ElementItem } from "@/types/content";

export function HomeElementsBar({ items }: { items: ElementItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="elements">
      {items.map((item) => (
        <div key={item.number} className="elem">
          <span className="elem-n">{item.number}</span>
          <div className="elem-dash" />
          <div className="elem-name">{item.name}</div>
        </div>
      ))}
    </div>
  );
}
