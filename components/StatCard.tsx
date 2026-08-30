export function StatCard({
  label,
  value,
  hint,
  tone = "",
  accentColor = "border-base-300",
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: string;
  accentColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`card-hover relative flex flex-col justify-between rounded-lg border bg-base-100 p-6 shadow-xs ${accentColor} transition-colors duration-300 hover:border-primary/50 top-gradient-border`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.72rem] font-bold tracking-wider uppercase text-base-content/80">
            {label}
          </span>
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
              {icon}
            </div>
          )}
        </div>
        <div
          className={`font-mono text-3xl font-extrabold tracking-tight sm:text-4xl ${tone}`}
        >
          {value}
        </div>
      </div>
      {hint && (
        <div className="mt-4 pt-3 border-t border-base-200 text-[0.72rem] font-medium text-base-content/80">
          {hint}
        </div>
      )}
    </div>
  );
}
