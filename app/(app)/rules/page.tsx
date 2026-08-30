import { GRADE_TABLE, GPA_LETTER_TABLE } from "@/lib/grading";
import { GradeBadge } from "@/components/GradeBadge";

export const metadata = { title: "Rules | Result Processing" };

const RULES = [
  {
    id: "R-11",
    title: "Theory & Practical Pass Thresholds",
    body: "Theory is out of 75 with a pass threshold of 25 (33%). Practical is out of 25 with a pass threshold of 8 (32%). Failing either part fails the entire subject (grade point 0.00), regardless of total score. Non-practical subjects are marked out of 100 with a pass threshold of 33.",
  },
  {
    id: "R-12",
    title: "Absence (AB) Handling",
    body: "An absence in a compulsory subject outputs AB, assigns grade point 0.00, and sets the overall result to F. An absence in an optional subject contributes 0 bonus points and triggers a flag on the administrative checking list.",
  },
  {
    id: "R-13",
    title: "GPA Formula & Cancellation Rule",
    body: "GPA = (compulsory grade points sum + max(0, optional grade point - 2)) / 6, capped at 5.00 (rounded to 2 decimal places). Any compulsory failure cancels the result to GPA 0.00 and Letter F, while raw uncancelled GPA remains visible in trace audits.",
  },
  {
    id: "R-10",
    title: "Grade Point & Letter Grade Mapping",
    body: "Individual subject grade points are derived from total subject marks out of 100 using the standard scale. Final cohort letter grades are determined by overall calculated GPA.",
  },
  {
    id: "R-29",
    title: "Administrative Checking Lists",
    body: "Optional List: optional grade point ≤ 2.00 or AB. Practical Fail List: practical score < 8 in any subject. Absentee List: AB in any course. Students triggering multiple thresholds appear on all relevant lists.",
  },
];

export default function RulesPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-lg border border-base-300 bg-base-100 p-8 sm:p-10 shadow-xs">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              Technical Specification
            </span>
            <span className="text-xs text-base-content/60 font-medium">
              Grade Calculation Protocol
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            GPA & Marking Rules Engine
          </h1>
          <p className="max-w-3xl text-sm opacity-75 leading-relaxed">
            Formal rule definitions enforced by the calculation engine in{" "}
            <code className="rounded-md bg-base-200 px-2 py-0.5 font-mono text-xs">
              lib/grading.ts
            </code>
            . Every audit trace links directly back to these rule identifiers.
          </p>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {RULES.map((r) => (
          <section
            key={r.id}
            className="card-hover flex flex-col justify-between rounded-lg border border-base-300 bg-base-100 p-6 shadow-xs transition-colors duration-300 hover:border-primary/50"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 border-b border-base-200 pb-4">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary border border-primary/20">
                  {r.id}
                </span>
                <span className="text-[0.7rem] font-semibold tracking-wider uppercase opacity-50">
                  Rule Standard
                </span>
              </div>
              <h2 className="text-base font-bold text-base-content">{r.title}</h2>
              <p className="text-xs leading-relaxed opacity-80">{r.body}</p>
            </div>
          </section>
        ))}
      </div>

      {/* Implementation Notes Callout */}
      <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-8 text-sky-900 dark:text-sky-200 shadow-xs">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-sky-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Specification Clarifications
            </span>
          </div>
          <div className="grid gap-6 text-xs leading-relaxed sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-sm">Subject Grade Point Scale</span>
              <p className="opacity-90">
                Subject grade points are derived from standard mark bandings matching the final GPA letter grade thresholds.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-sm">Non-Practical Coursework</span>
              <p className="opacity-90">
                Subjects without a practical component are evaluated out of 100 with a pass mark of 33, maintaining consistent 33% pass thresholds across all subjects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Tables */}
      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-lg border border-base-300 bg-base-100 p-5 sm:p-8 shadow-xs">
          <div className="border-b border-base-200 pb-5 mb-6">
            <h2 className="text-xl font-bold text-base-content">
              Subject Mark &rarr; Grade Point Scale (R-10)
            </h2>
            <p className="text-xs text-base-content/60">
              Evaluation out of 100 total marks
            </p>
          </div>

          <div className="overflow-hidden rounded-md border border-base-200">
            <div className="overflow-x-auto">
              <table className="table table-sm table-tight table-modern w-full">
                <thead>
                  <tr className="bg-base-200/50">
                    <th className="font-semibold py-3 px-4">Mark Range</th>
                    <th className="text-right font-semibold py-3 px-4">Grade Point</th>
                    <th className="font-semibold py-3 px-4">Letter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {GRADE_TABLE.map((row) => (
                    <tr key={row.letter} className="transition-colors duration-200 hover:bg-base-200/40">
                      <td className="font-mono text-xs font-medium opacity-75 py-3 px-4">
                        {row.min} - {row.max}
                      </td>
                      <td className="text-right font-mono text-xs font-bold text-primary py-3 px-4">
                        {row.point.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <GradeBadge letter={row.letter} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-base-300 bg-base-100 p-5 sm:p-8 shadow-xs">
          <div className="border-b border-base-200 pb-5 mb-6">
            <h2 className="text-xl font-bold text-base-content">
              Final GPA &rarr; Letter Grade Table (R-10)
            </h2>
            <p className="text-xs text-base-content/60">
              Overall cohort classification
            </p>
          </div>

          <div className="overflow-hidden rounded-md border border-base-200">
            <div className="overflow-x-auto">
              <table className="table table-sm table-tight table-modern w-full">
                <thead>
                  <tr className="bg-base-200/50">
                    <th className="font-semibold py-3 px-4">Calculated GPA Range</th>
                    <th className="font-semibold py-3 px-4">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {GPA_LETTER_TABLE.map((row) => (
                    <tr key={row.letter} className="transition-colors duration-200 hover:bg-base-200/40">
                      <td className="font-mono text-xs font-medium opacity-75 py-3 px-4">
                        {row.min === row.max
                          ? row.min.toFixed(2)
                          : `${row.min.toFixed(2)} - ${row.max.toFixed(2)}`}
                      </td>
                      <td className="py-3 px-4">
                        <GradeBadge letter={row.letter} size="sm" />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-rose-500/10 transition-colors duration-200 hover:bg-rose-500/15">
                    <td className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300 py-3 px-4">
                      Compulsory Fail (R-13)
                    </td>
                    <td className="py-3 px-4">
                      <GradeBadge letter="F" size="sm" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-[0.72rem] opacity-65">
            Note: Any compulsory subject failure overrides this table, forcing GPA to 0.00 and Letter Grade to F (R-13).
          </p>
        </section>
      </div>
    </div>
  );
}
