import type { ReactNode } from "react";
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="eyebrow">A little room for possibility</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
