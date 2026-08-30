"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GradeBadge } from "@/components/GradeBadge";
import { Pagination } from "@/components/Pagination";
import { formatGpa, type StudentResult } from "@/lib/grading";

/**
 * The students who sit exactly on a rule boundary. Each row carries the note
 * saying which edge it tests, because that note is the reason the row exists.
 */
export function EdgeCasesSection({
  edgeCases,
  flaggedCount,
}: {
  edgeCases: StudentResult[];
  flaggedCount: number;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(edgeCases.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return edgeCases.slice(start, start + pageSize);
  }, [edgeCases, currentPage, pageSize]);

  if (edgeCases.length === 0) return null;

  return (
    <section className="gp-card flex flex-col gap-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="gp-label">Students on a rule boundary</span>
          <p className="gp-body max-w-2xl">
            Each of these sits on the exact edge of a rule, so they are the ones
            that prove the engine handles the hard cases.
          </p>
        </div>
        <Link href="/checking-lists" className="gp-btn">
          {flaggedCount} to check
        </Link>
      </div>

      {/* Cards on small screens: a table this wide does not fold. */}
      <ul className="flex flex-col gap-3 md:hidden">
        {paginated.map((r) => (
          <li
            key={r.student.id}
            className="flex flex-col gap-3 border-t pt-3"
            style={{ borderColor: "var(--gp-rule)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/students/${r.student.id}`}
                  className="gp-label underline-offset-4 hover:underline"
                >
                  {r.student.name}
                </Link>
                <span className="gp-label-muted">
                  #{r.student.roll} · {r.student.className}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="gp-num text-sm">{formatGpa(r.gpa)}</span>
                <GradeBadge letter={r.letter} size="sm" />
              </div>
            </div>
            <p className="rule-text">{r.student.edgeCaseNote}</p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="gp-table table-tight w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-0 py-2">Student</th>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2 text-right">GPA</th>
              <th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">What it tests</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r) => (
              <tr key={r.student.id}>
                <td className="px-0 py-3 whitespace-nowrap">
                  <Link
                    href={`/students/${r.student.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {r.student.name}
                  </Link>
                  <span className="gp-label-muted block">#{r.student.roll}</span>
                </td>
                <td className="gp-label-muted px-3 py-3">
                  {r.student.className}
                </td>
                <td className="gp-num px-3 py-3 text-right">
                  {formatGpa(r.gpa)}
                </td>
                <td className="px-3 py-3">
                  <GradeBadge letter={r.letter} />
                </td>
                <td className="rule-text max-w-xl px-3 py-3">
                  {r.student.edgeCaseNote}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={edgeCases.length}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />
    </section>
  );
}
