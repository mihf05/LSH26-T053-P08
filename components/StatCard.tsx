export function StatCard({
  label,
  value,
  hint,
  tone = "",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: string;
}) {
  return (
    <div className="stat bg-base-100 border border-base-300 rounded-box">
      <div className="stat-title text-xs">{label}</div>
      <div className={`stat-value text-2xl ${tone}`}>{value}</div>
      {hint && <div className="stat-desc text-xs">{hint}</div>}
    </div>
  );
}
