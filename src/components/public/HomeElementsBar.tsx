import type { ElementItem } from "@/types/content";

export function HomeElementsBar({ items }: { items: ElementItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="elements-bar">
      {items.map((item) => (
        <div key={item.number} className="el-item">
          <div className="el-num">{item.number}</div>
          <div className="el-name">
            <em>{item.name}</em>
          </div>
        </div>
      ))}
    </div>
  );
}
