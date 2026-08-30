import { PageHeader } from "@/components/PageHeader";
import { StudentsTable, type StudentRowView } from "@/components/StudentsTable";
import { formatGpa } from "@/lib/grading";
import { getResultSet } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Students | GradePoint" };

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
      <PageHeader
        eyebrow={`${results.length} students · ${classes.length} classes`}
        title="Every student, every grade"
      >
        Open a row for the step by step trace: the mark used, the grade point it
        earned, and the rule that decided it.
      </PageHeader>
      <StudentsTable rows={rows} classes={classes} />
    </div>
  );
}
