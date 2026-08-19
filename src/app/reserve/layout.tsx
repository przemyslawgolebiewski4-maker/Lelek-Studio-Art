import type { ReactNode } from "react";

export default function ReserveLayout({ children }: { children: ReactNode }) {
  return <div className="reserve-root">{children}</div>;
}
