import Link from "next/link";
import { GradeBadge } from "@/components/GradeBadge";
import { formatGpa, type StudentResult } from "@/lib/grading";
import { getCheckingLists } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checking lists | Result Processing" };

function ListSection({
  id,
  title,
  rule,
  description,
  rows,
  detail,
  tone,
}: {
  id: string;
  title: string;
  rule: string;
  description: string;
  rows: StudentResult[];
  detail: (r: StudentResult) => React.ReactNode;
  tone: string;
}) {
  return (
    <section id={id} className="card bg-base-100 border border-base-300">
      <div className="card-body gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="card-title text-base">{title}</h2>
          <span className={`badge badge-sm ${tone}`}>
            {rows.length} students
          </span>
          <span className="badge badge-sm badge-ghost font-mono">{rule}</span>
        </div>
        <p className="text-sm opacity-70">{description}</p>
        <div className="overflow-x-auto">
          <table className="table table-sm table-tight">
            <thead>
              <tr>
                <th className="w-16">Roll</th>
                <th>Student</th>
                <th>Class</th>
                <th className="text-right">GPA</th>
                <th className="w-16">Grade</th>
                <th>What to verify</th>
                <th className="w-28">Also on</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.student.id} className="hover">
                  <td className="font-mono text-xs opacity-70">
                    {r.student.roll}
                  </td>
                  <td>
                    <Link
                      href={`/students/${r.student.id}`}
                      className="link link-hover font-medium whitespace-nowrap"
                    >
                      {r.student.name}
                    </Link>
                  </td>
                  <td className="text-xs opacity-70">{r.student.className}</td>
                  <td className="text-right font-mono">{formatGpa(r.gpa)}</td>
                  <td>
                    <GradeBadge letter={r.letter} size="xs" />
                  </td>
                  <td className="rule-text max-w-lg">{detail(r)}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {r.flags.optionalDidNotHelp && id !== "optional" && (
                        <span className="badge badge-xs badge-warning badge-outline">
                          opt
                        </span>
                      )}
                      {r.flags.practicalFail && id !== "practical" && (
                        <span className="badge badge-xs badge-error badge-outline">
                          prac
                        </span>
                      )}
                      {r.flags.absent && id !== "absent" && (
                        <span className="badge badge-xs badge-neutral">AB</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-sm opacity-60"
                  >
                    Nobody on this list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default async function CheckingListsPage() {
  const lists = await getCheckingLists();

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Checking lists</h1>
        <p className="max-w-3xl text-sm opacity-70">
          Every student whose printed result was changed by the optional subject
          rule, by a practical fail, or by an absent mark. A teacher should
          verify these {lists.any.length} students by hand before the results go
          out. A student can appear on more than one list (R-29).
        </p>
        <div className="mt-2 flex flex-wrap gap-2 no-print">
          <a href="#optional" className="btn btn-xs btn-outline">
            Optional rule ({lists.optional.length})
          </a>
          <a href="#practical" className="btn btn-xs btn-outline">
            Practical fail ({lists.practicalFail.length})
          </a>
          <a href="#absent" className="btn btn-xs btn-outline">
            Absent ({lists.absent.length})
          </a>
        </div>
      </header>

      <ListSection
        id="optional"
        title="Optional subject rule"
        rule="R-29"
        tone="badge-warning"
        description="Every student whose optional grade point is 2.00 or below, so max(0, optional - 2) added nothing to the GPA. An absent optional counts here too."
        rows={lists.optional}
        detail={(r) =>
          r.optional?.isAbsent
            ? `${r.optional.subject.name}: AB, grade point 0.00, bonus 0.00`
            : `${r.optional?.subject.name}: ${r.optional?.displayMark} marks, grade point ${r.optionalGradePoint.toFixed(2)}, bonus max(0, ${r.optionalGradePoint.toFixed(2)} - 2) = 0.00`
        }
      />

      <ListSection
        id="practical"
        title="Practical fail"
        rule="R-29"
        tone="badge-error"
        description="Every student with a practical part below 8 in any subject. The whole subject scores 0 even where the theory mark passed, so these marks are worth re-checking against the practical register."
        rows={lists.practicalFail}
        detail={(r) =>
          r.practicalFailures
            .map(
              (s) =>
                `${s.subject.name}: practical ${s.practicalMark}/${s.subject.practicalFull} (pass ${s.subject.practicalPass}), theory ${s.theoryMark}/${s.subject.theoryFull} passed`,
            )
            .join("; ")
        }
      />

      <ListSection
        id="absent"
        title="Absent marks"
        rule="R-29"
        tone="badge-neutral"
        description="Every student with AB in any subject. An absence in a compulsory subject makes the overall result F; an absence in the optional subject simply contributes 0."
        rows={lists.absent}
        detail={(r) =>
          r.absences
            .map(
              (s) =>
                `${s.subject.name} (${s.subject.isOptional ? "optional: contributes 0" : "compulsory: result F"})`,
            )
            .join("; ")
        }
      />
    </div>
  );
}
