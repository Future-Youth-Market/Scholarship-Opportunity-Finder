export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-slate-300 p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2">{children}</p>
    </div>
  );
}
