import type { ElementItem } from "@/types/content";

export function HomeElementsBar({
  items,
  scopeNote,
}: {
  items: ElementItem[];
  scopeNote?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="elements-wrap">
      {scopeNote ? <p className="elements-scope">{scopeNote}</p> : null}
      <div className="elements">
        {items.map((item) => (
          <div key={item.number} className="elem">
            <span className="elem-n">{item.number}</span>
            <div className="elem-dash" />
            <div className="elem-text">
              <div className="elem-name">{item.name}</div>
              {item.description ? (
                <div className="elem-desc">{item.description}</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
