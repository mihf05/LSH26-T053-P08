import type { StudentResult } from "@/lib/grading";

/** 0.00 -> 5.00 in quarter-point steps. Fine enough that the shape of the
 *  cohort shows through, coarse enough that every column holds someone. */
const STEP = 0.25;
const BUCKETS = Math.round(5 / STEP) + 1;

/**
 * The cohort's GPA spread as a column chart: hairline ink bars on a quiet
 * grid, the tallest one called out in the accent. Failures sit in the 0.00
 * column, which is where a cancelled result lands by rule.
 */
export function GpaDistributionChart({ results }: { results: StudentResult[] }) {
  const total = results.length;
  if (total === 0) return null;

  const counts = Array.from({ length: BUCKETS }, () => 0);
  for (const r of results) {
    const index = Math.min(Math.round(r.gpa / STEP), BUCKETS - 1);
    counts[index] += 1;
  }

  const peak = Math.max(...counts);
  const peakIndex = counts.indexOf(peak);
  // Round the axis up to a whole number of gridlines so the labels stay clean.
  const top = Math.max(Math.ceil(peak / 4) * 4, 4);
  const gridlines = [top, (top / 4) * 3, top / 2, top / 4, 0];

  const failed = counts[0];

  return (
    <div className="gp-card flex flex-col gap-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="gp-label">GPA distribution</span>
        <span className="gp-label-muted">
          {total} students · {failed} at 0.00
        </span>
      </div>

      <div className="flex gap-3">
        {/* Y axis. Each label is centred on its own gridline, so the two
            columns line up whatever the chart height is. */}
        <div className="relative h-[240px] w-8 shrink-0">
          {gridlines.map((value, i) => (
            <span
              key={value}
              className="gp-label-muted absolute right-0 -translate-y-1/2 leading-none"
              style={{ top: `${(i / (gridlines.length - 1)) * 100}%` }}
            >
              {value}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-[240px]">
            {/* Gridlines sit behind the bars, one per y-axis label. */}
            <div
              className="absolute inset-0 flex flex-col justify-between"
              aria-hidden
            >
              {gridlines.map((value) => (
                <span key={value} className="gp-gridline block h-px w-full" />
              ))}
            </div>

            <ol className="relative flex h-full items-end justify-between gap-[2px]">
              {counts.map((count, i) => {
                const gpa = (i * STEP).toFixed(2);
                const isPeak = i === peakIndex && count > 0;
                return (
                  <li
                    key={gpa}
                    className="relative flex h-full min-w-0 flex-1 items-end justify-center"
                  >
                    {isPeak && (
                      <span
                        className="gp-pill absolute left-1/2 -translate-x-1/2 px-2 py-1"
                        style={{
                          bottom: `calc(${(count / top) * 100}% + 6px)`,
                        }}
                      >
                        {count}
                      </span>
                    )}
                    <span
                      className="gp-bar block w-[3px] rounded-t-[1px]"
                      style={{
                        height: count === 0 ? "0" : `${(count / top) * 100}%`,
                      }}
                    />
                    <span className="sr-only">
                      GPA {gpa}: {count} students
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* X axis: label the whole grade points, skip the quarters. */}
          <div className="mt-2 flex justify-between">
            {counts.map((_, i) => (
              <span
                key={i}
                className="gp-label-muted min-w-0 flex-1 text-center leading-none"
              >
                {i % 4 === 0 ? i * STEP : " "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
