import Link from "next/link";
import { notFound } from "next/navigation";
import { GradeBadge } from "@/components/GradeBadge";
import { formatGpa, type SubjectResult } from "@/lib/grading";
import { getResultSet, getStudentResult } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STATUS_ROW: Record<string, string> = {
  absent: "bg-base-200/50",
  theory_fail: "bg-rose-500/10 dark:bg-rose-950/20",
  practical_fail: "bg-rose-500/10 dark:bg-rose-950/20",
  total_fail: "bg-rose-500/10 dark:bg-rose-950/20",
  pass: "",
};

function SubjectRow({ r }: { r: SubjectResult }) {
  return (
    <tr className={`transition-colors hover:bg-base-200/40 ${STATUS_ROW[r.status]}`}>
      <td className="whitespace-nowrap py-3">
        <div className="font-bold text-base-content">{r.subject.name}</div>
        <div className="flex items-center gap-1 text-[0.7rem] opacity-60">
          <span className="font-mono">{r.subject.code}</span>
          {r.subject.isOptional && (
            <span className="rounded bg-primary/10 px-1 font-semibold text-primary">
              Optional 4th
            </span>
          )}
          <span>
            &middot;{" "}
            {r.subject.hasPractical
              ? `${r.subject.theoryFull}+${r.subject.practicalFull} marks`
              : `${r.subject.theoryFull} marks`}
          </span>
        </div>
      </td>
      <td className="font-mono text-sm font-semibold">
        {r.isAbsent ? (
          <span className="rounded bg-slate-500/20 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
            AB
          </span>
        ) : (
          r.displayMark
        )}
      </td>
      <td className="text-right font-mono text-xs opacity-80">
        {r.isAbsent ? "-" : `${r.theoryMark}/${r.subject.theoryFull}`}
        <span className="block text-[0.65rem] opacity-55">
          pass &ge;{r.subject.theoryPass}
        </span>
      </td>
      <td className="text-right font-mono text-xs opacity-80">
        {!r.subject.hasPractical ? (
          <span className="opacity-40">n/a</span>
        ) : r.isAbsent ? (
          "-"
        ) : (
          <>
            {r.practicalMark}/{r.subject.practicalFull}
            <span className="block text-[0.65rem] opacity-55">
              pass &ge;{r.subject.practicalPass}
            </span>
          </>
        )}
      </td>
      <td className="text-right font-mono font-bold text-sm">
        {r.gradePoint.toFixed(2)}
      </td>
      <td>
        <GradeBadge letter={r.isAbsent ? "AB" : r.letter} size="sm" />
      </td>
      <td className="rule-text max-w-md text-xs leading-relaxed opacity-85">{r.rule}</td>
    </tr>
  );
}

export default async function StudentTracePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getStudentResult(Number(id));
  if (!result) notFound();

  const { results } = await getResultSet();
  const classmates = results.filter(
    (r) => r.student.classId === result.student.classId,
  );
  const index = classmates.findIndex((r) => r.student.id === result.student.id);
  const prev = classmates[index - 1];
  const next = classmates[index + 1];

  const rawGpa = (result.compulsorySum + result.optionalBonus) / 6;
  const wasCapped = rawGpa > 5;

  return (
    <div className="flex flex-col gap-8">
      {/* Navigation sub-header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        <Link
          href="/students"
          className="btn btn-ghost btn-xs rounded-md gap-1 text-base-content/75 hover:text-base-content transition-colors duration-200"
        >
          &larr; Back to Student Registry
        </Link>
        <div className="flex items-center gap-2">
          {prev && (
            <Link
              href={`/students/${prev.student.id}`}
              className="btn btn-ghost btn-xs rounded-md opacity-75 hover:opacity-100 transition-opacity duration-200"
            >
              &larr; Roll #{prev.student.roll} ({prev.student.name})
            </Link>
          )}
          {next && (
            <Link
              href={`/students/${next.student.id}`}
              className="btn btn-ghost btn-xs rounded-md opacity-75 hover:opacity-100 transition-opacity duration-200"
            >
              Roll #{next.student.roll} ({next.student.name}) &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* Student Profile Banner */}
      <div className="relative overflow-hidden rounded-lg border border-base-300 bg-base-100 p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {result.student.className}
              </span>
              <span className="font-mono text-xs font-medium opacity-80 text-base-content/80">
                Roll #{result.student.roll}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              {result.student.name}
            </h1>
            {result.student.edgeCaseNote && (
              <div className="mt-1 flex items-start gap-3 max-w-2xl text-xs rounded-md bg-amber-500/10 border border-amber-500/20 p-4 text-amber-900 dark:text-amber-200 font-medium">
                <span className="font-bold shrink-0 uppercase tracking-wider text-[0.65rem] rounded-md bg-amber-500/20 px-2 py-0.5">
                  Edge Case Boundary
                </span>
                <span>{result.student.edgeCaseNote}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 rounded-md bg-base-200/50 p-5 border border-base-200 self-start md:self-auto">
            <div className="flex flex-col text-right">
              <span className="text-[0.7rem] font-bold tracking-wider uppercase opacity-80 text-base-content/80">
                Final GPA Output
              </span>
              <span
                className={`font-mono text-4xl font-bold ${
                  result.passed
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {formatGpa(result.gpa)}
              </span>
              {!result.passed && (
                <span className="text-[0.7rem] opacity-80 font-mono mt-1 text-base-content/80">
                  Uncancelled: {formatGpa(result.uncancelledGpa)}
                </span>
              )}
            </div>
            <GradeBadge letter={result.letter} size="lg" />
          </div>
        </div>
      </div>

      {/* Failure Warning Card */}
      {!result.passed && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-6 text-rose-900 dark:text-rose-200 shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-rose-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                Result Cancelled (R-13)
              </span>
              <span className="text-xs font-semibold">
                Failed on {result.failedCompulsory.length} compulsory subject
                {result.failedCompulsory.length > 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              The student achieved an uncancelled average of{" "}
              <strong>
                {result.averageMark !== null
                  ? `${result.averageMark.toFixed(2)} / 100`
                  : "n/a"}
              </strong>{" "}
              and raw GPA of <strong>{formatGpa(result.uncancelledGpa)}</strong>. However, due to failure in compulsory coursework, Rule R-13 sets the final GPA to <strong>0.00</strong> and final letter grade to <strong>F</strong>.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.failedCompulsory.map((r) => (
                <div
                  key={r.subject.id}
                  className="rounded-md bg-base-100 px-3 py-1.5 text-xs font-semibold border border-rose-500/30 text-rose-700 dark:text-rose-300"
                >
                  {r.subject.name}: {r.rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subject Trace Section */}
      <section className="rounded-lg border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-1 border-b border-base-200 pb-5 mb-6">
          <h2 className="text-xl font-bold text-base-content">
            Subject Mark & Rule Trace
          </h2>
          <p className="text-xs text-base-content/60">
            Raw evaluation breakdown, component pass checks, and applied rule logic for each subject
          </p>
        </div>

        {/* Mobile Subject Cards (< md) */}
        <div className="flex flex-col gap-4 md:hidden">
          {[...result.compulsory, ...(result.optional ? [result.optional] : [])].map((r) => (
            <div
              key={r.subject.id}
              className={`rounded-md border p-4 flex flex-col gap-2.5 ${
                r.status === "pass"
                  ? "bg-base-200/30 border-base-200"
                  : "bg-rose-500/10 border-rose-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-base-content">{r.subject.name}</h4>
                  <div className="flex items-center gap-1.5 text-[0.7rem] opacity-65 font-mono">
                    <span>{r.subject.code}</span>
                    {r.subject.isOptional && (
                      <span className="rounded bg-primary/10 px-1 font-semibold text-primary">
                        Optional 4th
                      </span>
                    )}
                  </div>
                </div>
                <GradeBadge letter={r.isAbsent ? "AB" : r.letter} size="sm" />
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-base-200/60 text-xs font-mono">
                <div>
                  <span className="block text-[0.65rem] opacity-60 uppercase">Mark</span>
                  <span className="font-bold">{r.isAbsent ? "AB" : r.displayMark}</span>
                </div>
                <div>
                  <span className="block text-[0.65rem] opacity-60 uppercase">Theory</span>
                  <span>{r.isAbsent ? "-" : `${r.theoryMark}/${r.subject.theoryFull}`}</span>
                </div>
                <div>
                  <span className="block text-[0.65rem] opacity-60 uppercase">Practical</span>
                  <span>
                    {!r.subject.hasPractical ? "n/a" : r.isAbsent ? "-" : `${r.practicalMark}/${r.subject.practicalFull}`}
                  </span>
                </div>
              </div>

              <div className="text-xs text-base-content/85 leading-relaxed rule-text">
                <span className="font-semibold text-primary">Rule Trace:</span> {r.rule}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-hidden rounded-md border border-base-200">
          <div className="overflow-x-auto">
            <table className="table table-sm table-tight table-modern w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="font-semibold py-3 px-4">Subject</th>
                  <th className="font-semibold py-3 px-4">Mark Used</th>
                  <th className="text-right font-semibold py-3 px-4">Theory</th>
                  <th className="text-right font-semibold py-3 px-4">Practical</th>
                  <th className="text-right font-semibold py-3 px-4">Grade Point</th>
                  <th className="font-semibold py-3 px-4">Letter</th>
                  <th className="font-semibold py-3 px-4">Applied Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {result.compulsory.map((r) => (
                  <SubjectRow key={r.subject.id} r={r} />
                ))}
              </tbody>
              {result.optional && (
                <tbody className="border-t-2 border-primary/30">
                  <SubjectRow r={result.optional} />
                </tbody>
              )}
            </table>
          </div>
        </div>
      </section>

      {/* Calculation & Manual Check Dual Cards */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* GPA Calculation Card */}
        <section className="rounded-lg border border-base-300 bg-base-100 p-8 shadow-xs">
          <div className="border-b border-base-200 pb-5 mb-6">
            <h2 className="text-xl font-bold text-base-content">
              GPA Calculation Pipeline (R-13)
            </h2>
            <p className="text-xs text-base-content/60">
              Mathematical trace step-by-step formula execution
            </p>
          </div>

          <ol className="flex flex-col gap-4 text-xs">
            <li className="flex flex-col gap-1.5 rounded-md bg-base-200/40 p-4 border border-base-200">
              <span className="font-semibold opacity-70">1. Compulsory Grade Point Sum</span>
              <div className="font-mono text-xs font-bold text-base-content">
                {result.compulsory.map((r) => r.gradePoint.toFixed(2)).join(" + ")}{" "}
                = <span className="text-primary">{result.compulsorySum.toFixed(2)}</span>
              </div>
            </li>

            <li className="flex flex-col gap-1.5 rounded-md bg-base-200/40 p-4 border border-base-200">
              <span className="font-semibold opacity-70">
                2. Optional Subject Bonus (Points above 2.00)
              </span>
              <div className="font-mono text-xs font-bold text-base-content">
                max(0, {result.optionalGradePoint.toFixed(2)} - 2.00) ={" "}
                <span className="text-primary">{result.optionalBonus.toFixed(2)}</span>
              </div>
            </li>

            <li className="flex flex-col gap-1.5 rounded-md bg-base-200/40 p-4 border border-base-200">
              <span className="font-semibold opacity-70">3. Average Over 6 Subjects</span>
              <div className="font-mono text-xs font-bold text-base-content">
                ({result.compulsorySum.toFixed(2)} + {result.optionalBonus.toFixed(2)}) / 6 ={" "}
                <span className="text-primary">{formatGpa(rawGpa)}</span>
                {wasCapped && (
                  <span className="ml-2 rounded-md bg-sky-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-sky-700 dark:text-sky-300">
                    Capped at 5.00 (R-13)
                  </span>
                )}
              </div>
            </li>

            <li className="flex flex-col gap-1.5 rounded-md bg-base-200/40 p-4 border border-base-200">
              <span className="font-semibold opacity-70">4. Uncancelled Benchmark GPA</span>
              <div className="font-mono text-xs font-bold text-base-content">
                <span>{formatGpa(result.uncancelledGpa)}</span>
                {result.averageMark !== null && (
                  <span className="ml-2 opacity-65 font-normal">
                    (Mean raw mark: {result.averageMark.toFixed(2)} / 100)
                  </span>
                )}
              </div>
            </li>

            <li className="flex flex-col gap-1.5 rounded-md p-4 border font-semibold">
              <span className="opacity-75">5. Final Status Outcome</span>
              <div
                className={`rounded-md p-3 font-mono text-xs ${
                  result.passed
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30"
                }`}
              >
                {result.passed ? (
                  <>
                    Clean Pass &rarr; Final GPA <strong>{formatGpa(result.gpa)}</strong>, Letter Grade <strong>{result.letter}</strong>
                  </>
                ) : (
                  <>
                    Compulsory Fail &rarr; Final GPA <strong>0.00</strong>, Letter Grade <strong>F</strong>
                  </>
                )}
              </div>
            </li>
          </ol>
        </section>

        {/* Office Manual Check Card */}
        <section className="rounded-lg border border-base-300 bg-base-100 p-8 shadow-xs">
          <div className="border-b border-base-200 pb-5 mb-6">
            <h2 className="text-xl font-bold text-base-content">
              Office Verification Checklist
            </h2>
            <p className="text-xs text-base-content/60">
              Rules and condition flags triggered for administrative audit
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {result.impacts.length === 0 ? (
              <div className="rounded-md bg-base-200/40 p-5 text-xs opacity-75">
                No special boundary flags triggered. Standard grading rules applied.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {result.impacts.map((line, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-base-200 bg-base-100 p-4 text-xs leading-relaxed text-base-content/90 font-medium shadow-xs"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-base-200">
              <div className="flex flex-wrap gap-2">
                {result.flags.optionalDidNotHelp && (
                  <span className="rounded-md px-2.5 py-1 text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    Optional List
                  </span>
                )}
                {result.flags.practicalFail && (
                  <span className="rounded-md px-2.5 py-1 text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                    Practical Fail List
                  </span>
                )}
                {result.flags.absent && (
                  <span className="rounded-md px-2.5 py-1 text-xs font-semibold bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30">
                    Absentee List
                  </span>
                )}
              </div>

              <Link
                href="/checking-lists"
                className="btn btn-outline btn-xs rounded-md text-xs transition-colors duration-200"
              >
                Open Checking Lists &rarr;
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
