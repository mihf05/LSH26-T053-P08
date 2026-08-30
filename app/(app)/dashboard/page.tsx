import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { GpaDistributionChart } from "@/components/GpaDistributionChart";
import { ClassSummaryCard } from "@/components/ClassSummaryCard";
import { EdgeCasesSection } from "@/components/EdgeCasesSection";
import { StudentsTable, type StudentRowView } from "@/components/StudentsTable";
import { formatGpa } from "@/lib/grading";
import { getResultSet } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "GradePoint — School Result Processing and GPA Engine",
  description:
    "Grade points, GPAs, per student calculation traces and the office checking lists, computed from raw marks and traceable to a rule.",
};

export default async function DashboardPage() {
  const { classes, results } = await getResultSet();

  const passed = results.filter((r) => r.passed);

  const gpaOfPassing = passed.map((r) => r.gpa);
  const averageGpa =
    gpaOfPassing.length > 0
      ? gpaOfPassing.reduce((a, b) => a + b, 0) / gpaOfPassing.length
      : 0;

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
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-lg border border-base-300 bg-base-100 p-8 sm:p-10 shadow-xs top-gradient-border">
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="size-2 rounded-full bg-primary status-dot-pulse" />
                Executive Dashboard
              </span>
              <span className="text-xs text-base-content/60 font-medium">
                Rule Engine v2.4 Active
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
              School Result Processing System
            </h1>
            <p className="max-w-2xl text-sm opacity-75 leading-relaxed">
              Real-time GPA computation, subject mark verification, and administrative audit tracing for{" "}
              <span className="font-bold text-base-content">{results.length} enrolled students</span> across{" "}
              <span className="font-bold text-base-content">{classes.length} academic classes</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#student-roster"
              className="btn btn-primary btn-sm rounded-md shadow-xs gap-2 transition-colors duration-200"
            >
              Quick Search Roster
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <Link
              href="/rules"
              className="btn btn-outline btn-sm rounded-md transition-colors duration-200"
            >
              Rule Specification
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students Enrolled"
          value={results.length}
          hint={`${classes.length} Academic Cohorts`}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Passed Cohort"
          value={passed.length}
          tone="text-emerald-600 dark:text-emerald-400"
          hint={`${Math.round((passed.length / results.length) * 100)}% Overall Pass Rate`}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Mean Passing GPA"
          value={formatGpa(averageGpa)}
          tone="text-primary"
          hint="Calculated across passing students"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          label="Audit Check Flags"
          value={
            results.filter(
              (r) =>
                r.flags.optionalDidNotHelp ||
                r.flags.practicalFail ||
                r.flags.absent,
            ).length
          }
          tone="text-amber-600 dark:text-amber-400"
          hint="Requires teacher verification"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Analytics Grid: Visual GPA Chart + Class Summaries */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GpaDistributionChart results={results} />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-base-content">Classes Breakdown</h3>
            <span className="text-xs font-semibold text-base-content/60 font-mono">
              {classes.length} Active
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {classes.map((cls) => (
              <ClassSummaryCard key={cls.id} className={cls.name} results={results} />
            ))}
          </div>
        </div>
      </div>

      {/* Boundary & Edge Case Verification Card */}
      <EdgeCasesSection
        edgeCases={edgeCases}
        flaggedCount={results.filter((r) => r.flags.optionalDidNotHelp || r.flags.practicalFail || r.flags.absent).length}
      />

      {/* Main Student Registry Section */}
      <section id="student-roster" className="scroll-mt-20 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-base-content">
            Full Student Roster & Transcript Registry
          </h2>
          <p className="text-xs text-base-content/60">
            Interactive filtering by class, status, or name search with instant rule trace access
          </p>
        </div>
        <StudentsTable rows={rows} classes={classes} />
      </section>
    </div>
  );
}
