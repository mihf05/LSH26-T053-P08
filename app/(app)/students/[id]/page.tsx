import Link from "next/link";
import { notFound } from "next/navigation";
import { GradeBadge } from "@/components/GradeBadge";
import { formatGpa, type SubjectResult } from "@/lib/grading";
import { getResultSet, getStudentResult } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STATUS_ROW: Record<string, string> = {
  absent: "bg-base-200",
  theory_fail: "bg-error/10",
  practical_fail: "bg-error/10",
  total_fail: "bg-error/10",
  pass: "",
};

function SubjectRow({ r }: { r: SubjectResult }) {
  return (
    <tr className={STATUS_ROW[r.status]}>
      <td className="whitespace-nowrap">
        <span className="font-medium">{r.subject.name}</span>
        <span className="block text-xs opacity-60">
          {r.subject.code}
          {r.subject.isOptional && " · optional"}
          {r.subject.hasPractical
            ? ` · ${r.subject.theoryFull}+${r.subject.practicalFull}`
            : ` · ${r.subject.theoryFull}`}
        </span>
      </td>
      <td className="font-mono text-sm font-semibold">
        {r.isAbsent ? (
          <span className="badge badge-sm badge-neutral">AB</span>
        ) : (
          r.displayMark
        )}
      </td>
      <td className="text-right font-mono text-xs opacity-80">
        {r.isAbsent ? "-" : `${r.theoryMark}/${r.subject.theoryFull}`}
        <span className="block opacity-60">pass {r.subject.theoryPass}</span>
      </td>
      <td className="text-right font-mono text-xs opacity-80">
        {!r.subject.hasPractical ? (
          <span className="opacity-50">n/a</span>
        ) : r.isAbsent ? (
          "-"
        ) : (
          <>
            {r.practicalMark}/{r.subject.practicalFull}
            <span className="block opacity-60">
              pass {r.subject.practicalPass}
            </span>
          </>
        )}
      </td>
      <td className="text-right font-mono font-semibold">
        {r.gradePoint.toFixed(2)}
      </td>
      <td>
        <GradeBadge letter={r.isAbsent ? "AB" : r.letter} size="xs" />
      </td>
      <td className="rule-text max-w-md">{r.rule}</td>
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2 text-sm no-print">
        <Link href="/students" className="link link-hover opacity-70">
          &larr; All students
        </Link>
        <span className="ml-auto flex gap-1">
          {prev && (
            <Link
              href={`/students/${prev.student.id}`}
              className="btn btn-xs btn-ghost"
            >
              &larr; Roll {prev.student.roll}
            </Link>
          )}
          {next && (
            <Link
              href={`/students/${next.student.id}`}
              className="btn btn-xs btn-ghost"
            >
              Roll {next.student.roll} &rarr;
            </Link>
          )}
        </span>
      </div>

      <header className="card bg-base-100 border border-base-300">
        <div className="card-body flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{result.student.name}</h1>
            <p className="text-sm opacity-70">
              Roll {result.student.roll} &middot; {result.student.className}
            </p>
            {result.student.edgeCaseNote && (
              <p className="mt-2 max-w-2xl text-xs opacity-70">
                <span className="badge badge-xs badge-warning badge-outline mr-1 align-middle">
                  edge case
                </span>
                {result.student.edgeCaseNote}
              </p>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide opacity-60">
                Final GPA
              </div>
              <div
                className={`font-mono text-4xl font-bold ${result.passed ? "" : "text-error"}`}
              >
                {formatGpa(result.gpa)}
              </div>
            </div>
            <GradeBadge letter={result.letter} size="lg" />
          </div>
        </div>
      </header>

      {!result.passed && (
        <div className="alert alert-error items-start">
          <div className="flex w-full flex-col gap-1">
            <h2 className="font-semibold">
              Failed on {result.failedCompulsory.length} compulsory subject
              {result.failedCompulsory.length > 1 ? "s" : ""}:{" "}
              {result.failedCompulsory.map((r) => r.subject.name).join(", ")}
            </h2>
            <p className="text-sm">
              The uncancelled average is{" "}
              <strong>
                {result.averageMark !== null
                  ? `${result.averageMark.toFixed(2)} / 100`
                  : "n/a"}
              </strong>{" "}
              and the uncancelled GPA is{" "}
              <strong>{formatGpa(result.uncancelledGpa)}</strong>, but R-13 sets
              the final GPA to 0.00 and the letter grade to F.
            </p>
            <ul className="list-inside list-disc text-sm">
              {result.failedCompulsory.map((r) => (
                <li key={r.subject.id}>
                  <strong>{r.subject.name}</strong> — {r.rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <section className="card bg-base-100 border border-base-300">
        <div className="card-body gap-3">
          <h2 className="card-title text-base">Subject trace</h2>
          <p className="text-sm opacity-70">
            The mark used for every subject, the grade point it produced and the
            rule that decided it.
          </p>
          <div className="overflow-x-auto">
            <table className="table table-sm table-tight">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Mark used</th>
                  <th className="text-right">Theory</th>
                  <th className="text-right">Practical</th>
                  <th className="text-right">Grade point</th>
                  <th>Letter</th>
                  <th>Rule that decided it</th>
                </tr>
              </thead>
              <tbody>
                {result.compulsory.map((r) => (
                  <SubjectRow key={r.subject.id} r={r} />
                ))}
              </tbody>
              {result.optional && (
                <tbody className="border-t-2 border-base-300">
                  <SubjectRow r={result.optional} />
                </tbody>
              )}
            </table>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">GPA calculation (R-13)</h2>
            <ol className="flex flex-col gap-2 text-sm">
              <li>
                <span className="opacity-60">1. Compulsory grade points</span>
                <div className="mt-1 rounded-box bg-base-200 px-3 py-2 font-mono text-xs">
                  {result.compulsory
                    .map((r) => r.gradePoint.toFixed(2))
                    .join(" + ")}{" "}
                  = <strong>{result.compulsorySum.toFixed(2)}</strong>
                </div>
              </li>
              <li>
                <span className="opacity-60">
                  2. Optional subject, only the part above 2.00 counts
                </span>
                <div className="mt-1 rounded-box bg-base-200 px-3 py-2 font-mono text-xs">
                  max(0, {result.optionalGradePoint.toFixed(2)} - 2) ={" "}
                  <strong>{result.optionalBonus.toFixed(2)}</strong>
                </div>
              </li>
              <li>
                <span className="opacity-60">3. Divide by 6</span>
                <div className="mt-1 rounded-box bg-base-200 px-3 py-2 font-mono text-xs">
                  ({result.compulsorySum.toFixed(2)} +{" "}
                  {result.optionalBonus.toFixed(2)}) / 6 ={" "}
                  <strong>{formatGpa(rawGpa)}</strong>
                  {wasCapped && (
                    <span className="ml-2 badge badge-xs badge-info">
                      capped at 5.00
                    </span>
                  )}
                </div>
              </li>
              <li>
                <span className="opacity-60">
                  4. Uncancelled GPA, kept visible whatever happens next
                </span>
                <div className="mt-1 rounded-box bg-base-200 px-3 py-2 font-mono text-xs">
                  <strong>{formatGpa(result.uncancelledGpa)}</strong>
                  {result.averageMark !== null && (
                    <span className="ml-2 opacity-70">
                      (average mark {result.averageMark.toFixed(2)} / 100)
                    </span>
                  )}
                </div>
              </li>
              <li>
                <span className="opacity-60">5. Final result</span>
                <div
                  className={`mt-1 rounded-box px-3 py-2 font-mono text-xs ${result.passed ? "bg-success/15" : "bg-error/15"}`}
                >
                  {result.passed ? (
                    <>
                      no compulsory failure &rarr; GPA{" "}
                      <strong>{formatGpa(result.gpa)}</strong>, letter{" "}
                      <strong>{result.letter}</strong> (R-10)
                    </>
                  ) : (
                    <>
                      compulsory failure &rarr; GPA <strong>0.00</strong>,
                      letter <strong>F</strong> (R-13)
                    </>
                  )}
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">
              What the office should check by hand
            </h2>
            {result.impacts.length === 0 ? (
              <p className="text-sm opacity-70">
                Nothing. No rule changed this student&apos;s result, so they are
                on none of the three checking lists.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {result.impacts.map((line, i) => (
                  <li
                    key={i}
                    className="rounded-box border border-base-300 px-3 py-2 text-sm"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-1 pt-1">
              {result.flags.optionalDidNotHelp && (
                <span className="badge badge-sm badge-warning badge-outline">
                  optional list
                </span>
              )}
              {result.flags.practicalFail && (
                <span className="badge badge-sm badge-error badge-outline">
                  practical fail list
                </span>
              )}
              {result.flags.absent && (
                <span className="badge badge-sm badge-neutral">
                  absent list
                </span>
              )}
            </div>
            <Link
              href="/checking-lists"
              className="btn btn-sm btn-outline w-fit"
            >
              Open the checking lists
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
