import type { StudentResult } from "@/lib/grading";

/** One class, summarised: mean GPA as the number, pass rate as the accent, and
 *  a hairline track showing where the mean sits on the 0-5 scale. */
export function ClassSummaryCard({
  className,
  results,
}: {
  className: string;
  results: StudentResult[];
}) {
  const classResults = results.filter((r) => r.student.className === className);
  const total = classResults.length;
  if (total === 0) return null;

  const passed = classResults.filter((r) => r.passed).length;
  const passRate = Math.round((passed / total) * 100);
  const avgGpa = classResults.reduce((acc, r) => acc + r.gpa, 0) / total;

  return (
    <div className="gp-card flex flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="gp-label">{className}</span>
        <span className="gp-pill">{passRate}% pass</span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="gp-metric-sm">{avgGpa.toFixed(2)}</span>
        <span className="gp-unit">mean GPA</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="gp-gridline relative h-px w-full">
          <span
            className="gp-bar absolute top-[-3px] block h-[7px] w-[2px]"
            style={{ left: `${(avgGpa / 5) * 100}%` }}
            aria-hidden
          />
        </div>
        <div className="flex justify-between">
          <span className="gp-label-muted">
            {passed} passed · {total - passed} failed
          </span>
          <span className="gp-label-muted">{total} enrolled</span>
        </div>
      </div>
    </div>
  );
}
