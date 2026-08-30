import { StudentsTable, type StudentRowView } from "@/components/StudentsTable";
import { formatGpa } from "@/lib/grading";
import { getResultSet } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Students | Result Processing" };

export default async function StudentsPage() {
  const { classes, results } = await getResultSet();

  const rows: StudentRowView[] = results.map((r) => ({
    id: r.student.id,
    roll: r.student.roll,
    name: r.student.name,
    className: r.student.className,
    classId: r.student.classId,
    gpa: formatGpa(r.gpa),
    uncancelledGpa: formatGpa(r.uncancelledGpa),
    letter: r.letter,
    passed: r.passed,
    averageMark: r.averageMark,
    optionalGradePoint: r.optionalGradePoint,
    optionalBonus: r.optionalBonus.toFixed(2),
    flags: r.flags,
    failedSubjects: r.failedCompulsory.map((s) => s.subject.name),
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-base-300 bg-base-100 p-8 shadow-xs">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Student Directory
            </span>
            <span className="text-xs text-base-content/60 font-medium">
              {results.length} Enrolled
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            Student Performance Registry
          </h1>
          <p className="max-w-3xl text-sm opacity-75 leading-relaxed">
            Detailed transcript index showing calculated GPA, letter grades, and subject failure flags. Click any student record to view the step-by-step rule execution trace.
          </p>
        </div>
      </div>
      <StudentsTable rows={rows} classes={classes} />
    </div>
  );
}
