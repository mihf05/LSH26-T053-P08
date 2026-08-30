"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GradeBadge } from "@/components/GradeBadge";
import { Pagination } from "@/components/Pagination";

export type StudentRowView = {
  id: number;
  roll: number;
  name: string;
  className: string;
  classId: number;
  gpa: string;
  uncancelledGpa: string;
  letter: string;
  passed: boolean;
  averageMark: number | null;
  optionalGradePoint: number;
  optionalBonus: string;
  flags: {
    optionalDidNotHelp: boolean;
    practicalFail: boolean;
    absent: boolean;
  };
  failedSubjects: string[];
};

type SortKey = "roll" | "name" | "gpa" | "average";

/** The three flags, with the wording the office uses for each. */
const FLAGS = [
  {
    key: "optionalDidNotHelp" as const,
    label: "opt",
    title: "Optional grade point 2.00 or below: it added nothing",
  },
  {
    key: "practicalFail" as const,
    label: "prac",
    title: "Practical below the pass mark in at least one subject",
  },
  {
    key: "absent" as const,
    label: "AB",
    title: "Absent in at least one subject",
  },
];

export function StudentsTable({
  rows,
  classes,
}: {
  rows: StudentRowView[];
  classes: { id: number; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState<number | "all">("all");
  const [outcome, setOutcome] = useState<"all" | "passed" | "failed">("all");
  const [flag, setFlag] = useState<"all" | "optional" | "practical" | "absent">(
    "all",
  );
  const [sort, setSort] = useState<SortKey>("roll");
  const [desc, setDesc] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (classId !== "all" && r.classId !== classId) return false;
      if (outcome === "passed" && !r.passed) return false;
      if (outcome === "failed" && r.passed) return false;
      if (flag === "optional" && !r.flags.optionalDidNotHelp) return false;
      if (flag === "practical" && !r.flags.practicalFail) return false;
      if (flag === "absent" && !r.flags.absent) return false;
      if (q && !`${r.name} ${r.roll}`.toLowerCase().includes(q)) return false;
      return true;
    });

    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "gpa":
          return Number(a.gpa) - Number(b.gpa);
        case "average":
          return (a.averageMark ?? 0) - (b.averageMark ?? 0);
        default:
          return a.classId - b.classId || a.roll - b.roll;
      }
    });
    return desc ? sorted.reverse() : sorted;
  }, [rows, search, classId, outcome, flag, sort, desc]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };
  const handleClassChange = (val: number | "all") => {
    setClassId(val);
    setPage(1);
  };
  const handleOutcomeChange = (val: typeof outcome) => {
    setOutcome(val);
    setPage(1);
  };
  const handleFlagChange = (val: typeof flag) => {
    setFlag(val);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const header = (key: SortKey, label: string, align = "") => (
    <th className={`px-3 py-2 ${align}`}>
      <button
        type="button"
        className="inline-flex items-center gap-1 uppercase hover:opacity-60"
        onClick={() => {
          if (sort === key) setDesc((d) => !d);
          else {
            setSort(key);
            setDesc(false);
          }
        }}
      >
        {label}
        {sort === key && <span aria-hidden>{desc ? "↓" : "↑"}</span>}
      </button>
    </th>
  );

  const isFiltered =
    search || classId !== "all" || outcome !== "all" || flag !== "all";

  const clearFilters = () => {
    setSearch("");
    setClassId("all");
    setOutcome("all");
    setFlag("all");
    setPage(1);
  };

  const empty = (
    <span className="gp-body">
      No student matches these filters. Widen one, or reset them all.
    </span>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="no-print gp-card flex flex-col gap-4 p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="gp-input"
            placeholder="Search name or roll"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search by name or roll"
          />

          <select
            className="gp-select"
            value={classId}
            aria-label="Filter by class"
            onChange={(e) =>
              handleClassChange(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
          >
            <option value="all">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="gp-select"
            value={outcome}
            aria-label="Filter by outcome"
            onChange={(e) =>
              handleOutcomeChange(e.target.value as typeof outcome)
            }
          >
            <option value="all">All outcomes</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            className="gp-select"
            value={flag}
            aria-label="Filter by checking flag"
            onChange={(e) => handleFlagChange(e.target.value as typeof flag)}
          >
            <option value="all">All flags</option>
            <option value="optional">Optional did not help</option>
            <option value="practical">Practical fail</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="gp-label-muted">
            {filtered.length} of {rows.length} students
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="gp-label underline underline-offset-4 hover:opacity-60"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Cards on small screens; the table has too many columns to fold. */}
      <div className="flex flex-col gap-3 md:hidden">
        {paginatedRows.map((r) => (
          <div key={r.id} className="gp-card flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/students/${r.id}`}
                  className="gp-h2 underline-offset-4 hover:underline"
                >
                  {r.name}
                </Link>
                <span className="gp-label-muted">
                  #{r.roll} · {r.className}
                </span>
              </div>
              <GradeBadge letter={r.letter} size="md" />
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="gp-label-muted">GPA</span>
                <span className="flex items-baseline gap-1.5">
                  <span className="gp-metric-sm">{r.gpa}</span>
                  {!r.passed && (
                    <span className="gp-unit">was {r.uncancelledGpa}</span>
                  )}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="gp-label-muted">Average mark</span>
                <span className="gp-num text-sm">
                  {r.averageMark !== null ? r.averageMark.toFixed(1) : "—"}
                </span>
              </div>
            </div>

            {(r.failedSubjects.length > 0 ||
              FLAGS.some((f) => r.flags[f.key])) && (
              <div
                className="flex flex-wrap items-center gap-2 border-t pt-3"
                style={{ borderColor: "var(--gp-rule)" }}
              >
                {FLAGS.filter((f) => r.flags[f.key]).map((f) => (
                  <span key={f.key} className="gp-flag" title={f.title}>
                    {f.label}
                  </span>
                ))}
                {r.failedSubjects.length > 0 && (
                  <span className="gp-label-muted">
                    Cancelled by {r.failedSubjects.join(", ")}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="gp-card p-8 text-center">{empty}</div>
        )}
      </div>

      <div className="gp-card hidden overflow-x-auto p-5 sm:p-6 md:block">
        <table className="gp-table table-tight w-full text-left text-sm">
          <thead>
            <tr>
              {header("roll", "Roll")}
              {header("name", "Student")}
              <th className="px-3 py-2">Class</th>
              {header("average", "Avg mark", "text-right")}
              {header("gpa", "GPA", "text-right")}
              <th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">Flags</th>
              <th className="px-3 py-2">Cancelled by</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((r) => (
              <tr key={r.id}>
                <td className="gp-num px-3 py-3 text-xs">#{r.roll}</td>
                <td className="px-3 py-3">
                  <Link
                    href={`/students/${r.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {r.name}
                  </Link>
                </td>
                <td className="gp-label-muted px-3 py-3">{r.className}</td>
                <td className="gp-num px-3 py-3 text-right text-xs">
                  {r.averageMark !== null ? r.averageMark.toFixed(1) : "—"}
                </td>
                <td className="gp-num px-3 py-3 text-right whitespace-nowrap">
                  {r.gpa}
                  {!r.passed && (
                    <span className="gp-unit ml-1.5">
                      was {r.uncancelledGpa}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <GradeBadge letter={r.letter} size="sm" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {FLAGS.filter((f) => r.flags[f.key]).map((f) => (
                      <span key={f.key} className="gp-flag" title={f.title}>
                        {f.label}
                      </span>
                    ))}
                    {!FLAGS.some((f) => r.flags[f.key]) && (
                      <span className="gp-label-muted">—</span>
                    )}
                  </div>
                </td>
                <td className="gp-label-muted px-3 py-3">
                  {r.failedSubjects.length > 0
                    ? r.failedSubjects.join(", ")
                    : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center">
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
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />
    </div>
  );
}
