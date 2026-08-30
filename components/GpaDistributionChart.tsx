"use client";

import type { StudentResult } from "@/lib/grading";

interface GpaDistributionChartProps {
  results: StudentResult[];
}

export function GpaDistributionChart({ results }: GpaDistributionChartProps) {
  const total = results.length;
  if (total === 0) return null;

  const brackets = [
    {
      label: "5.00 (A+)",
      count: results.filter((r) => r.passed && r.gpa === 5).length,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "4.00 - 4.99",
      count: results.filter((r) => r.passed && r.gpa >= 4 && r.gpa < 5).length,
      color: "bg-indigo-500",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "3.50 - 3.99",
      count: results.filter((r) => r.passed && r.gpa >= 3.5 && r.gpa < 4).length,
      color: "bg-sky-500",
      textColor: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "3.00 - 3.49",
      count: results.filter((r) => r.passed && r.gpa >= 3.0 && r.gpa < 3.5).length,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "< 3.00",
      count: results.filter((r) => r.passed && r.gpa < 3.0).length,
      color: "bg-orange-500",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "0.00 (Failed)",
      count: results.filter((r) => !r.passed).length,
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  const maxCount = Math.max(...brackets.map((b) => b.count), 1);

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xs top-gradient-border flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-4 border-b border-base-200 pb-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span>GPA Cohort Distribution</span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-mono font-semibold text-primary">
                {total} Total
              </span>
            </h3>
            <p className="text-xs text-base-content/60">
              Grade point distribution breakdown across all classes
            </p>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="flex flex-col gap-3.5">
          {brackets.map((b) => {
            const percentage = ((b.count / total) * 100).toFixed(1);
            const barWidth = `${Math.max((b.count / maxCount) * 100, 3)}%`;

            return (
              <div key={b.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-base-content/80 font-mono">{b.label}</span>
                  <span className="text-base-content/60 font-mono">
                    <strong className={b.textColor}>{b.count}</strong> ({percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-md bg-base-200 overflow-hidden">
                  <div
                    className={`h-full rounded-md ${b.color} transition-all duration-500 ease-out`}
                    style={{ width: barWidth }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-base-200 flex flex-wrap items-center justify-between gap-2 text-[0.72rem] text-base-content/60">
        <span>Highest concentration: {brackets.reduce((prev, current) => (prev.count > current.count ? prev : current)).label}</span>
        <span className="font-semibold text-primary">Live Engine Metrics</span>
      </div>
    </div>
  );
}
