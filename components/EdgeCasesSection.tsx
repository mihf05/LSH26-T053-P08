"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { GradeBadge } from "@/components/GradeBadge";
import { Pagination } from "@/components/Pagination";
import { formatGpa, type StudentResult } from "@/lib/grading";

interface EdgeCasesSectionProps {
  edgeCases: StudentResult[];
  flaggedCount: number;
}

export function EdgeCasesSection({ edgeCases, flaggedCount }: EdgeCasesSectionProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(edgeCases.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);

  const paginatedEdgeCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return edgeCases.slice(start, start + pageSize);
  }, [edgeCases, currentPage, pageSize]);

  return (
    <section className="rounded-lg border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-200 pb-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-base-content">
            Boundary & Edge Case Verification
          </h2>
          <p className="text-xs text-base-content/60">
            Students strategically positioned at rule thresholds to validate calculation logic
          </p>
        </div>
        <Link
          href="/checking-lists"
          className="btn btn-outline btn-sm rounded-md text-xs gap-2 transition-colors duration-200"
        >
          Review Checking Lists
          <span className="badge badge-sm badge-secondary font-mono rounded-xs">
            {flaggedCount}
          </span>
        </Link>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="flex flex-col gap-3 md:hidden">
        {paginatedEdgeCases.map((r) => (
          <div
            key={r.student.id}
            className="rounded-md border border-base-200 bg-base-200/40 p-4 flex flex-col gap-2"
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
                <span className="font-mono text-sm font-bold text-base-content">
                  {formatGpa(r.gpa)}
                </span>
                <GradeBadge letter={r.letter} size="sm" />
              </div>
            </div>
            <p className="text-xs text-base-content/85 bg-base-100 p-2.5 rounded-md border border-base-200 leading-relaxed font-medium">
              {r.student.edgeCaseNote}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-hidden rounded-md border border-base-200">
        <div className="overflow-x-auto">
          <table className="table table-sm table-tight table-modern w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th className="font-semibold py-3 px-4">Student</th>
                <th className="font-semibold py-3 px-4">Class</th>
                <th className="text-right font-semibold py-3 px-4">GPA</th>
                <th className="font-semibold py-3 px-4">Grade</th>
                <th className="font-semibold py-3 px-4">Edge Case Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {paginatedEdgeCases.map((r) => (
                <tr key={r.student.id} className="transition-colors duration-200 hover:bg-base-200/40">
                  <td className="whitespace-nowrap py-3.5 px-4">
                    <Link
                      href={`/students/${r.student.id}`}
                      className="font-bold text-base-content hover:text-primary transition-colors duration-200"
                    >
                      {r.student.name}
                    </Link>
                    <span className="block font-mono text-[0.7rem] opacity-60">
                      Roll #{r.student.roll}
                    </span>
                  </td>
                  <td className="text-xs opacity-75 py-3.5 px-4">{r.student.className}</td>
                  <td className="text-right font-mono text-sm font-bold py-3.5 px-4">
                    {formatGpa(r.gpa)}
                  </td>
                  <td className="py-3.5 px-4">
                    <GradeBadge letter={r.letter} />
                  </td>
                  <td className="max-w-xl text-xs leading-relaxed opacity-85 py-3.5 px-4">
                    <span className="rounded-md bg-base-200/70 px-2.5 py-1 font-medium">
                      {r.student.edgeCaseNote}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={edgeCases.length}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />
    </section>
  );
}
