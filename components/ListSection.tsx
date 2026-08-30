"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GradeBadge } from "@/components/GradeBadge";
import { Pagination } from "@/components/Pagination";
import { formatGpa, type StudentResult } from "@/lib/grading";

/** One checking list. The note column is the point of the screen: it says what
 *  the teacher should look at, in the same words the rule uses. */
export function ListSection({
  id,
  title,
  rule,
  description,
  rows,
  type,
}: {
  id: string;
  title: string;
  rule: string;
  description: string;
  rows: StudentResult[];
  type: "optional" | "practical" | "absent";
}) {
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
        ? `${r.optional.subject.name}: absent, so 0.00 grade points and no bonus`
        : `${r.optional?.subject.name}: ${r.optional?.displayMark} marks, ${r.optionalGradePoint.toFixed(2)} grade points, bonus max(0, ${r.optionalGradePoint.toFixed(2)} − 2.00) = +0.00`;
    }
    if (type === "practical") {
      return r.practicalFailures
        .map(
          (s) =>
            `${s.subject.name}: practical ${s.practicalMark}/${s.subject.practicalFull}, under the ${s.subject.practicalPass} pass mark — theory passed at ${s.theoryMark}/${s.subject.theoryFull}`,
        )
        .join("; ");
    }
    return r.absences
      .map(
        (s) =>
          `${s.subject.name} — ${s.subject.isOptional ? "optional, so no bonus" : "compulsory, so the result is F"}`,
      )
      .join("; ");
  };

  /** The other lists this student also appears on. */
  const alsoOn = (r: StudentResult) =>
    [
      r.flags.optionalDidNotHelp && id !== "optional" ? "opt" : null,
      r.flags.practicalFail && id !== "practical" ? "prac" : null,
      r.flags.absent && id !== "absent" ? "AB" : null,
    ].filter(Boolean) as string[];

  const empty = (
    <span className="gp-body">No student is on this list. Nothing to check.</span>
  );

  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="gp-h2">{title}</h2>
          <span className="gp-pill">{rows.length} students</span>
          <span className="gp-label-muted">{rule}</span>
        </div>
        <p className="gp-body max-w-3xl">{description}</p>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {paginatedRows.map((r) => (
          <div key={r.student.id} className="gp-card flex flex-col gap-3 p-5">
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
            <p className="rule-text">{renderDetail(r)}</p>
            {alsoOn(r).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {alsoOn(r).map((f) => (
                  <span key={f} className="gp-flag">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <div className="gp-card p-8 text-center">{empty}</div>
        )}
      </div>

      <div className="gp-card hidden overflow-x-auto p-5 sm:p-6 md:block">
        <table className="gp-table table-tight w-full text-left text-sm">
          <thead>
            <tr>
              <th className="w-14 px-0 py-2">Roll</th>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2 text-right">GPA</th>
              <th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">What to check</th>
              <th className="w-24 px-3 py-2">Also on</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((r) => (
              <tr key={r.student.id}>
                <td className="gp-num px-0 py-3 text-xs">#{r.student.roll}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <Link
                    href={`/students/${r.student.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {r.student.name}
                  </Link>
                </td>
                <td className="gp-label-muted px-3 py-3">
                  {r.student.className}
                </td>
                <td className="gp-num px-3 py-3 text-right">
                  {formatGpa(r.gpa)}
                </td>
                <td className="px-3 py-3">
                  <GradeBadge letter={r.letter} size="sm" />
                </td>
                <td className="rule-text max-w-lg px-3 py-3">
                  {renderDetail(r)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {alsoOn(r).map((f) => (
                      <span key={f} className="gp-flag">
                        {f}
                      </span>
                    ))}
                    {alsoOn(r).length === 0 && (
                      <span className="gp-label-muted">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={rows.length}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />
    </section>
  );
}
