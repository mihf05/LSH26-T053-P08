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
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-sm opacity-70">
          Every student with the GPA the engine produced. A cancelled GPA shows
          the uncancelled figure beside it, and the last column names the
          subject that cancelled it. Open a student for the full trace.
        </p>
      </header>
      <StudentsTable rows={rows} classes={classes} />
    </div>
  );
}
