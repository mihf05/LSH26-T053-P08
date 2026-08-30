import Link from "next/link";
import { GradeBadge } from "@/components/GradeBadge";
import { StatCard } from "@/components/StatCard";
import { formatGpa } from "@/lib/grading";
import { getResultSet } from "@/lib/queries";

export const dynamic = "force-dynamic";

const LETTERS = ["A+", "A", "A-", "B", "C", "D", "F"];

export default async function DashboardPage() {
  const { classes, results, subjectsByClass } = await getResultSet();

  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);
  const distribution = LETTERS.map((letter) => ({
    letter,
    count: results.filter((r) => r.letter === letter).length,
  }));
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  const flagged = {
    optional: results.filter((r) => r.flags.optionalDidNotHelp).length,
    practical: results.filter((r) => r.flags.practicalFail).length,
    absent: results.filter((r) => r.flags.absent).length,
  };

  const gpaOfPassing = passed.map((r) => r.gpa);
  const averageGpa =
    gpaOfPassing.length > 0
      ? gpaOfPassing.reduce((a, b) => a + b, 0) / gpaOfPassing.length
      : 0;

  const edgeCases = results.filter((r) => r.student.edgeCaseNote);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Result summary</h1>
        <p className="max-w-3xl text-sm opacity-70">
          {results.length} students across {classes.length} classes, six
          compulsory subjects and one optional subject each. Grade points, GPAs
          and the office checking lists below are all computed from the raw
          marks every time this page is loaded.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Students"
          value={results.length}
          hint={`${classes.length} classes`}
        />
        <StatCard
          label="Passed"
          value={passed.length}
          tone="text-success"
          hint={`${Math.round((passed.length / results.length) * 100)}% pass rate`}
        />
        <StatCard
          label="Failed"
          value={failed.length}
          tone="text-error"
          hint="any compulsory failure"
        />
        <StatCard
          label="GPA 5.00"
          value={results.filter((r) => r.letter === "A+").length}
          hint="capped at 5.00 (R-13)"
        />
        <StatCard
          label="Average GPA"
          value={formatGpa(averageGpa)}
          hint="of the students who passed"
        />
        <StatCard
          label="To check by hand"
          value={
            results.filter(
              (r) =>
                r.flags.optionalDidNotHelp ||
                r.flags.practicalFail ||
                r.flags.absent,
            ).length
          }
          tone="text-warning"
          hint="on at least one list"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <h2 className="card-title text-base">Letter grade distribution</h2>
            <div className="flex flex-col gap-2">
              {distribution.map((d) => (
                <div key={d.letter} className="flex items-center gap-3">
                  <span className="w-8 shrink-0">
                    <GradeBadge letter={d.letter} size="sm" />
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-base-200">
                    <div
                      className={`h-full rounded-full ${d.letter === "F" ? "bg-error" : "bg-primary"}`}
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono text-sm">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <h2 className="card-title text-base">Classes</h2>
            <div className="flex flex-col gap-3">
              {classes.map((cls) => {
                const inClass = results.filter(
                  (r) => r.student.classId === cls.id,
                );
                const subjects = subjectsByClass.get(cls.id) ?? [];
                const optional = subjects.find((s) => s.isOptional);
                const classPassed = inClass.filter((r) => r.passed);
                return (
                  <div
                    key={cls.id}
                    className="rounded-box border border-base-300 p-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{cls.name}</h3>
                      <span className="text-xs opacity-60">
                        {inClass.length} students &middot; {classPassed.length}{" "}
                        passed
                      </span>
                    </div>
                    <p className="mt-1 text-xs opacity-70">
                      Compulsory:{" "}
                      {subjects
                        .filter((s) => !s.isOptional)
                        .map((s) => s.name)
                        .join(", ")}
                    </p>
                    <p className="mt-1 text-xs opacity-70">
                      Optional (fourth subject): {optional?.name ?? "-"}
                    </p>
                  </div>
                );
              })}
            </div>
            <Link href="/students" className="btn btn-sm btn-primary w-fit">
              Open the student list
            </Link>
          </div>
        </section>
      </div>

      <section className="card bg-base-100 border border-base-300">
        <div className="card-body gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="card-title text-base">
              Hard edge cases in the cohort
            </h2>
            <Link href="/checking-lists" className="btn btn-sm btn-outline">
              Checking lists ({flagged.optional} / {flagged.practical} /{" "}
              {flagged.absent})
            </Link>
          </div>
          <p className="text-sm opacity-70">
            These {edgeCases.length} students were placed deliberately: each one
            sits on a boundary the rules have to get right. Open a student to
            see the rule that decided every subject.
          </p>
          <div className="overflow-x-auto">
            <table className="table table-sm table-tight">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th className="text-right">GPA</th>
                  <th>Grade</th>
                  <th>Why it is an edge case</th>
                </tr>
              </thead>
              <tbody>
                {edgeCases.map((r) => (
                  <tr key={r.student.id} className="hover">
                    <td className="whitespace-nowrap">
                      <Link
                        href={`/students/${r.student.id}`}
                        className="link link-hover font-medium"
                      >
                        {r.student.name}
                      </Link>
                      <span className="block text-xs opacity-60">
                        Roll {r.student.roll}
                      </span>
                    </td>
                    <td className="text-xs opacity-70">
                      {r.student.className}
                    </td>
                    <td className="text-right font-mono">{formatGpa(r.gpa)}</td>
                    <td>
                      <GradeBadge letter={r.letter} />
                    </td>
                    <td className="max-w-xl text-xs opacity-80">
                      {r.student.edgeCaseNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
