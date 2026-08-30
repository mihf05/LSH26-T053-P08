/**
 * A single measure: mono label at the top, the number at the bottom in the
 * display face, and an optional delta or note on the baseline beside it.
 * Laid out like the metric tiles in the product UI on the landing page.
 */
export function StatCard({
  label,
  value,
  unit,
  hint,
  delta,
  accent = false,
}: {
  label: string;
  value: string | number;
  /** Rides on the number's baseline, e.g. "MWh", "/ 5.00". */
  unit?: string;
  /** Sits under the number, quiet. */
  hint?: string;
  /** Right of the number, in the data blue. */
  delta?: string;
  /** Fills the top-right block with the accent, for the one tile worth it. */
  accent?: boolean;
}) {
  return (
    <div className="gp-card flex min-h-[172px] flex-col justify-between gap-6 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="gp-label">{label}</span>
        {accent && (
          <span
            className="gp-bar-accent block h-11 w-16 shrink-0 rounded-[4px]"
            aria-hidden
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-baseline gap-1.5">
            <span className="gp-metric">{value}</span>
            {unit && <span className="gp-unit">{unit}</span>}
          </span>
          {delta && <span className="gp-delta">{delta}</span>}
        </div>
        {hint && <span className="gp-label-muted">{hint}</span>}
      </div>
    </div>
  );
}
