import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { GpaDistributionChart } from "@/components/GpaDistributionChart";
import { ClassSummaryCard } from "@/components/ClassSummaryCard";
import { EdgeCasesSection } from "@/components/EdgeCasesSection";
import { PageHeader, SectionHeader } from "@/components/PageHeader";
import { StudentsTable, type StudentRowView } from "@/components/StudentsTable";
import { formatGpa } from "@/lib/grading";
import { getResultSet } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard | GradePoint" };

export default async function DashboardPage() {
  const { classes, results } = await getResultSet();

  const passed = results.filter((r) => r.passed);
  const passRate = Math.round((passed.length / results.length) * 100);

  const gpaOfPassing = passed.map((r) => r.gpa);
  const averageGpa =
    gpaOfPassing.length > 0
      ? gpaOfPassing.reduce((a, b) => a + b, 0) / gpaOfPassing.length
      : 0;

  const flagged = results.filter(
    (r) => r.flags.optionalDidNotHelp || r.flags.practicalFail || r.flags.absent,
  );

  const edgeCases = results.filter((r) => r.student.edgeCaseNote);

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
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={`${classes.length} classes · results recomputed on load`}
        title="Results are ready to review"
        actions={
          <>
            <Link href="/checking-lists" className="gp-btn gp-btn-primary">
              Open checking lists
            </Link>
            <Link href="/rules" className="gp-btn">
              Rules
            </Link>
          </>
        }
      >
        {flagged.length} of {results.length} students need a teacher to verify
        something before results go out.
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Students"
          value={results.length}
          hint={`Across ${classes.length} classes`}
        />
        <StatCard
          label="Passed"
          value={passed.length}
          delta={`${passRate}%`}
          hint={`${results.length - passed.length} failed`}
        />
        <StatCard
          label="Mean GPA"
          value={formatGpa(averageGpa)}
          unit="/ 5.00"
          hint="Passing students only"
        />
        <StatCard
          label="Needs checking"
          value={flagged.length}
          hint="Optional, practical or absent"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GpaDistributionChart results={results} />
        </div>
        <div className="flex flex-col gap-4">
          {classes.map((cls) => (
            <ClassSummaryCard
              key={cls.id}
              className={cls.name}
              results={results}
            />
          ))}
        </div>
      </div>

      <EdgeCasesSection edgeCases={edgeCases} flaggedCount={flagged.length} />

      <section id="student-roster" className="flex scroll-mt-24 flex-col gap-5">
        <SectionHeader title="Every student" meta={`${results.length} records`}>
          Filter by class, outcome or flag. Open a row for the step by step
          trace behind that student&apos;s grade.
        </SectionHeader>
        <StudentsTable rows={rows} classes={classes} />
      </section>
    </div>
  );
}
