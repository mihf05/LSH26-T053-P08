import Link from "next/link";
import { notFound } from "next/navigation";
import { GradeBadge } from "@/components/GradeBadge";
import { SectionHeader } from "@/components/PageHeader";
import { formatGpa, type SubjectResult } from "@/lib/grading";
import { getResultSet, getStudentResult } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getStudentResult(Number(id));
  return { title: result ? `${result.student.name} | GradePoint` : "GradePoint" };
}

function SubjectRow({ r }: { r: SubjectResult }) {
  const failed = r.status !== "pass";

  return (
    <tr>
      <td className="px-0 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span>{r.subject.name}</span>
          {r.subject.isOptional && (
            <span className="gp-pill-quiet">optional</span>
          )}
        </div>
        <span className="gp-label-muted block">
          {r.subject.code} ·{" "}
          {r.subject.hasPractical
            ? `${r.subject.theoryFull}+${r.subject.practicalFull}`
            : `${r.subject.theoryFull}`}{" "}
          marks
        </span>
      </td>
      <td className="gp-num px-3 py-3">{r.isAbsent ? "AB" : r.displayMark}</td>
      <td className="gp-num px-3 py-3 text-right text-xs">
        {r.isAbsent ? "—" : `${r.theoryMark}/${r.subject.theoryFull}`}
        <span className="gp-label-muted block">≥{r.subject.theoryPass}</span>
      </td>
      <td className="gp-num px-3 py-3 text-right text-xs">
        {!r.subject.hasPractical ? (
          <span className="gp-label-muted">n/a</span>
        ) : r.isAbsent ? (
          "—"
        ) : (
          <>
            {r.practicalMark}/{r.subject.practicalFull}
            <span className="gp-label-muted block">
              ≥{r.subject.practicalPass}
            </span>
          </>
        )}
      </td>
      <td className="gp-num px-3 py-3 text-right">
        {r.gradePoint.toFixed(2)}
      </td>
      <td className="px-3 py-3">
        <GradeBadge letter={r.isAbsent ? "AB" : r.letter} size="sm" />
      </td>
      <td className="rule-text max-w-md px-3 py-3">
        {failed && <span className="gp-flag mr-2 align-middle">fail</span>}
        {r.rule}
      </td>
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

  const subjects = [
    ...result.compulsory,
    ...(result.optional ? [result.optional] : []),
  ];

  /** The computation, in the order the engine runs it. The numbering is the
   *  sequence itself, not decoration -- each step feeds the next. */
  const steps = [
    {
      label: "Add the compulsory grade points",
      value: `${result.compulsory.map((r) => r.gradePoint.toFixed(2)).join(" + ")} = ${result.compulsorySum.toFixed(2)}`,
    },
    {
      label: "Take whatever the optional subject earned above 2.00",
      value: `max(0, ${result.optionalGradePoint.toFixed(2)} − 2.00) = ${result.optionalBonus.toFixed(2)}`,
    },
    {
      label: "Divide by six",
      value: `(${result.compulsorySum.toFixed(2)} + ${result.optionalBonus.toFixed(2)}) / 6 = ${formatGpa(rawGpa)}${wasCapped ? "  → capped at 5.00" : ""}`,
    },
    {
      label: "Before any cancellation",
      value:
        result.averageMark !== null
          ? `${formatGpa(result.uncancelledGpa)}  ·  mean mark ${result.averageMark.toFixed(2)}/100`
          : formatGpa(result.uncancelledGpa),
    },
    {
      label: result.passed ? "Nothing cancels it" : "A compulsory fail cancels it",
      value: result.passed
        ? `GPA ${formatGpa(result.gpa)}, grade ${result.letter}`
        : `GPA 0.00, grade F (R-13)`,
    },
  ];

  const listFlags = [
    result.flags.optionalDidNotHelp && "Optional list",
    result.flags.practicalFail && "Practical fail list",
    result.flags.absent && "Absentee list",
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-10">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link href="/students" className="gp-label underline-offset-4 hover:underline">
          ← All students
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {prev && (
            <Link href={`/students/${prev.student.id}`} className="gp-btn">
              ← #{prev.student.roll}
            </Link>
          )}
          {next && (
            <Link href={`/students/${next.student.id}`} className="gp-btn">
              #{next.student.roll} →
            </Link>
          )}
        </div>
      </div>

      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="gp-label-muted">
            #{result.student.roll} · {result.student.className}
          </span>
          <h1 className="gp-h1">{result.student.name}</h1>
          {result.student.edgeCaseNote && (
            <p className="gp-sub max-w-2xl">{result.student.edgeCaseNote}</p>
          )}
        </div>

        <div className="gp-card flex items-end gap-6 self-start p-5 md:self-auto">
          <div className="flex flex-col gap-2">
            <span className="gp-label">Final GPA</span>
            <span className="flex items-baseline gap-1.5">
              <span className="gp-metric">{formatGpa(result.gpa)}</span>
              <span className="gp-unit">/ 5.00</span>
            </span>
            {!result.passed && (
              <span className="gp-label-muted">
                was {formatGpa(result.uncancelledGpa)} before cancellation
              </span>
            )}
          </div>
          <GradeBadge letter={result.letter} size="lg" />
        </div>
      </header>

      {!result.passed && (
        <section className="gp-card flex flex-col gap-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="gp-pill">Result cancelled</span>
            <span className="gp-label">R-13</span>
          </div>
          <p className="gp-body max-w-3xl">
            {result.student.name} averaged{" "}
            {result.averageMark !== null
              ? `${result.averageMark.toFixed(2)} out of 100`
              : "n/a"}{" "}
            for an uncancelled GPA of {formatGpa(result.uncancelledGpa)}. Failing{" "}
            {result.failedCompulsory.length} compulsory subject
            {result.failedCompulsory.length > 1 ? "s" : ""} sets the printed
            result to 0.00 and F regardless.
          </p>
          <ul className="flex flex-wrap gap-2">
            {result.failedCompulsory.map((r) => (
              <li key={r.subject.id} className="gp-pill-quiet">
                {r.subject.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-5">
        <SectionHeader title="Subject by subject" meta={`${subjects.length} subjects`}>
          The mark the engine used, the grade point it earned, and the rule that
          decided it.
        </SectionHeader>

        <div className="flex flex-col gap-3 md:hidden">
          {subjects.map((r) => (
            <div key={r.subject.id} className="gp-card flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="gp-label">{r.subject.name}</span>
                  <span className="gp-label-muted">
                    {r.subject.code}
                    {r.subject.isOptional && " · optional"}
                  </span>
                </div>
                <GradeBadge letter={r.isAbsent ? "AB" : r.letter} size="md" />
              </div>

              <div
                className="grid grid-cols-3 gap-3 border-y py-3"
                style={{ borderColor: "var(--gp-rule)" }}
              >
                <div className="flex flex-col gap-1">
                  <span className="gp-label-muted">Mark</span>
                  <span className="gp-num text-sm">
                    {r.isAbsent ? "AB" : r.displayMark}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="gp-label-muted">Theory</span>
                  <span className="gp-num text-sm">
                    {r.isAbsent ? "—" : `${r.theoryMark}/${r.subject.theoryFull}`}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="gp-label-muted">Practical</span>
                  <span className="gp-num text-sm">
                    {!r.subject.hasPractical
                      ? "n/a"
                      : r.isAbsent
                        ? "—"
                        : `${r.practicalMark}/${r.subject.practicalFull}`}
                  </span>
                </div>
              </div>

              <p className="rule-text">{r.rule}</p>
            </div>
          ))}
        </div>

        <div className="gp-card hidden overflow-x-auto p-5 sm:p-6 md:block">
          <table className="gp-table table-tight w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-0 py-2">Subject</th>
                <th className="px-3 py-2">Mark used</th>
                <th className="px-3 py-2 text-right">Theory</th>
                <th className="px-3 py-2 text-right">Practical</th>
                <th className="px-3 py-2 text-right">Grade point</th>
                <th className="px-3 py-2">Letter</th>
                <th className="px-3 py-2">Rule</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((r) => (
                <SubjectRow key={r.subject.id} r={r} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="flex flex-col gap-5">
          <SectionHeader title="How the GPA was reached" meta="R-13" />
          <ol className="gp-card flex flex-col p-5 sm:p-6">
            {steps.map((step, i) => (
              <li
                key={step.label}
                className={`flex flex-col gap-1.5 py-4 ${i > 0 ? "border-t" : "pt-0"}`}
                style={{ borderColor: "var(--gp-rule)" }}
              >
                <span className="flex items-baseline gap-2">
                  <span className="gp-label-muted">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <span className="gp-label">{step.label}</span>
                </span>
                <span className="gp-num pl-8 text-sm">{step.value}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader
            title="What the office should check"
            meta={listFlags.length > 0 ? `${listFlags.length} flags` : "clear"}
          />
          <div className="gp-card flex flex-col gap-5 p-5 sm:p-6">
            {result.impacts.length === 0 ? (
              <p className="gp-body">
                Nothing here needs a second pair of eyes. The standard rules
                covered every subject.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {result.impacts.map((line, i) => (
                  <li key={i} className="gp-body">
                    {line}
                  </li>
                ))}
              </ul>
            )}

            <div
              className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"
              style={{ borderColor: "var(--gp-rule)" }}
            >
              <div className="flex flex-wrap gap-2">
                {listFlags.map((f) => (
                  <span key={f} className="gp-flag">
                    {f}
                  </span>
                ))}
                {listFlags.length === 0 && (
                  <span className="gp-label-muted">On no checking list</span>
                )}
              </div>
              <Link href="/checking-lists" className="gp-btn no-print">
                Checking lists
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
