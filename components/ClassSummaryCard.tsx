"use client";

import type { StudentResult } from "@/lib/grading";

interface ClassSummaryCardProps {
  className: string;
  results: StudentResult[];
}

export function ClassSummaryCard({ className, results }: ClassSummaryCardProps) {
  const classResults = results.filter((r) => r.student.className === className);
  const total = classResults.length;
  if (total === 0) return null;

  const passed = classResults.filter((r) => r.passed).length;
  const passRate = ((passed / total) * 100).toFixed(0);
  
  const gpaSum = classResults.reduce((acc, r) => acc + r.gpa, 0);
  const avgGpa = (gpaSum / total).toFixed(2);
  const gpaProgress = (Number(avgGpa) / 5) * 100;

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-6 shadow-xs card-hover flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-xs">
              {className.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-sm text-base-content">{className}</h4>
              <span className="text-[0.7rem] text-base-content/80 font-mono font-medium">
                {total} Enrolled
              </span>
            </div>
          </div>
          <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {passRate}% Passed
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-base-content/80 font-medium">Average GPA</span>
            <span className="font-mono font-bold text-primary">{avgGpa} / 5.00</span>
          </div>
          <div className="h-2 w-full rounded-md bg-base-200 overflow-hidden">
            <div
              className="h-full rounded-md bg-primary transition-all duration-500"
              style={{ width: `${gpaProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-[0.7rem] opacity-90 font-medium">
        <span>Passed: <strong className="text-emerald-700 dark:text-emerald-300">{passed}</strong></span>
        <span>Failed: <strong className="text-rose-700 dark:text-rose-300">{total - passed}</strong></span>
      </div>
    </div>
  );
}
