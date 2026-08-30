"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { GradeBadge } from "@/components/GradeBadge";
import { Pagination } from "@/components/Pagination";
import { formatGpa, type StudentResult } from "@/lib/grading";

interface ListSectionProps {
  id: string;
  title: string;
  rule: string;
  description: string;
  rows: StudentResult[];
  toneClass: string;
  badgeBg: string;
  type: "optional" | "practical" | "absent";
}

export function ListSection({
  id,
  title,
  rule,
  description,
  rows,
  toneClass,
  badgeBg,
  type,
}: ListSectionProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, currentPage, pageSize]);

  const renderDetail = (r: StudentResult) => {
    if (type === "optional") {
      return r.optional?.isAbsent
        ? `${r.optional.subject.name}: AB (Absent), grade point 0.00, bonus +0.00`
        : `${r.optional?.subject.name}: ${r.optional?.displayMark} marks, grade point ${r.optionalGradePoint.toFixed(2)}, bonus max(0, ${r.optionalGradePoint.toFixed(2)} - 2.00) = +0.00`;
    }
    if (type === "practical") {
      return r.practicalFailures
        .map(
          (s) =>
            `${s.subject.name}: practical ${s.practicalMark}/${s.subject.practicalFull} (pass threshold ${s.subject.practicalPass}), theory ${s.theoryMark}/${s.subject.theoryFull} passed`,
        )
        .join("; ");
    }
    return r.absences
      .map(
        (s) =>
          `${s.subject.name} (${s.subject.isOptional ? "optional: bonus +0.00" : "compulsory: overall result F"})`,
      )
      .join("; ");
  };

  return (
    <section
      id={id}
      className={`rounded-lg border bg-base-100 p-6 sm:p-8 shadow-xs ${toneClass} transition-colors duration-300 scroll-mt-24`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-200 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-base-content">{title}</h2>
            <span className={`rounded-md px-3 py-1 text-xs font-bold ${badgeBg}`}>
              {rows.length} Students
            </span>
            <span className="rounded-md bg-base-200 px-2.5 py-1 font-mono text-xs font-semibold text-base-content/75">
              Rule {rule}
            </span>
          </div>
        </div>

        <p className="text-xs leading-relaxed opacity-75">{description}</p>

        {/* Mobile Card Stack View (< md) */}
        <div className="flex flex-col gap-4 md:hidden">
          {paginatedRows.map((r) => (
            <div
              key={r.student.id}
              className="rounded-md border border-base-200 bg-base-200/30 p-4 flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/students/${r.student.id}`}
                    className="font-bold text-sm text-base-content hover:text-primary transition-colors"
                  >
                    {r.student.name}
                  </Link>
                  <span className="block font-mono text-[0.7rem] opacity-60">
                    Roll #{r.student.roll} &middot; {r.student.className}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-base-content">
                    {formatGpa(r.gpa)}
                  </span>
                  <GradeBadge letter={r.letter} size="sm" />
                </div>
              </div>

              <div className="text-xs text-base-content/85 bg-base-100 p-2.5 rounded-md border border-base-200 leading-relaxed font-medium">
                {renderDetail(r)}
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="py-6 text-center text-sm opacity-60">
              No student records present on this verification list.
            </div>
          )}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-hidden rounded-md border border-base-200">
          <div className="overflow-x-auto">
            <table className="table table-sm table-tight table-modern w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="w-16 font-semibold py-3 px-4">Roll</th>
                  <th className="font-semibold py-3 px-4">Student Name</th>
                  <th className="font-semibold py-3 px-4">Class</th>
                  <th className="text-right font-semibold py-3 px-4">GPA</th>
                  <th className="w-16 font-semibold py-3 px-4">Grade</th>
                  <th className="font-semibold py-3 px-4">Verification Audit Notes</th>
                  <th className="w-28 font-semibold py-3 px-4">Also On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {paginatedRows.map((r) => (
                  <tr key={r.student.id} className="transition-colors duration-200 hover:bg-base-200/40">
                    <td className="font-mono text-xs font-semibold opacity-65 py-3.5 px-4">
                      #{r.student.roll}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/students/${r.student.id}`}
                        className="font-bold text-base-content hover:text-primary transition-colors duration-200 whitespace-nowrap"
                      >
                        {r.student.name}
                      </Link>
                    </td>
                    <td className="text-xs opacity-75 py-3.5 px-4">{r.student.className}</td>
                    <td className="text-right font-mono text-xs font-bold py-3.5 px-4">
                      {formatGpa(r.gpa)}
                    </td>
                    <td className="py-3.5 px-4">
                      <GradeBadge letter={r.letter} size="sm" />
                    </td>
                    <td className="rule-text max-w-lg text-xs leading-relaxed opacity-85 py-3.5 px-4">
                      {renderDetail(r)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {r.flags.optionalDidNotHelp && id !== "optional" && (
                          <span className="rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            opt
                          </span>
                        )}
                        {r.flags.practicalFail && id !== "practical" && (
                          <span className="rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                            prac
                          </span>
                        )}
                        {r.flags.absent && id !== "absent" && (
                          <span className="rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/20">
                            AB
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-sm opacity-60"
                    >
                      No student records present on this verification list.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={rows.length}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setPage(1);
          }}
        />
      </div>
    </section>
  );
}
