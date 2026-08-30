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

  // Pagination State
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

  // Reset page when filters change
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
    <th className={align}>
      <button
        type="button"
        className="inline-flex items-center gap-1 font-semibold hover:text-primary transition-colors"
        onClick={() => {
          if (sort === key) setDesc((d) => !d);
          else {
            setSort(key);
            setDesc(false);
          }
        }}
      >
        {label}
        {sort === key && (
          <span className="text-[0.65rem] text-primary">{desc ? "▼" : "▲"}</span>
        )}
      </button>
    </th>
  );

  const isFiltered = search || classId !== "all" || outcome !== "all" || flag !== "all";

  const clearFilters = () => {
    setSearch("");
    setClassId("all");
    setOutcome("all");
    setFlag("all");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Responsive Filter Toolbar */}
      <div className="rounded-lg border border-base-300 bg-base-100 p-5 sm:p-6 shadow-xs no-print">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative flex items-center col-span-1 sm:col-span-2 lg:col-span-1">
              <input
                className="input input-sm input-bordered w-full rounded-md pl-9 pr-12 text-xs focus:border-primary focus:outline-hidden"
                placeholder="Search name or roll..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <svg
                className="absolute left-3 size-4 opacity-50 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <kbd className="absolute right-2.5 pointer-events-none inline-flex h-5 select-none items-center rounded-md border border-base-300 bg-base-200/80 px-1.5 font-mono text-[0.65rem] font-semibold text-base-content/60">
                ⌘F
              </kbd>
            </div>

            <select
              className="select select-sm select-bordered w-full rounded-md text-xs font-medium"
              value={classId}
              onChange={(e) =>
                handleClassChange(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="select select-sm select-bordered w-full rounded-md text-xs font-medium"
              value={outcome}
              onChange={(e) => handleOutcomeChange(e.target.value as typeof outcome)}
            >
              <option value="all">All Outcomes</option>
              <option value="passed">Passed Cohort</option>
              <option value="failed">Failed Cohort</option>
            </select>

            <select
              className="select select-sm select-bordered w-full rounded-md text-xs font-medium"
              value={flag}
              onChange={(e) => handleFlagChange(e.target.value as typeof flag)}
            >
              <option value="all">All Checking Flags</option>
              <option value="optional">Optional did not help</option>
              <option value="practical">Practical fail</option>
              <option value="absent">Absent marker</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-base-200">
            <div className="text-xs font-medium text-base-content/70">
              Showing <span className="font-bold text-base-content">{filtered.length}</span> of{" "}
              <span>{rows.length}</span> students
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-ghost btn-xs text-xs text-rose-600 hover:bg-rose-500/10 transition-colors duration-200"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive Card Stack View (< md) */}
      <div className="flex flex-col gap-4 md:hidden">
        {paginatedRows.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-xs flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 rounded-full shrink-0 ${
                    r.passed ? "bg-emerald-500 status-dot-pulse" : "bg-rose-500"
                  }`}
                />
                <div className="size-8 rounded-md bg-base-200 flex items-center justify-center font-bold text-xs text-base-content/70">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <Link
                    href={`/students/${r.id}`}
                    className="font-bold text-base text-base-content hover:text-primary transition-colors"
                  >
                    {r.name}
                  </Link>
                  <span className="block font-mono text-xs opacity-60">
                    Roll #{r.roll} &middot; {r.className}
                  </span>
                </div>
              </div>
              <GradeBadge letter={r.letter} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-base-200 text-xs">
              <div className="flex flex-col">
                <span className="text-[0.68rem] opacity-60 uppercase font-semibold">Final GPA</span>
                <span className="font-mono font-bold text-base">
                  {r.gpa}{" "}
                  {!r.passed && (
                    <span className="text-[0.65rem] font-normal opacity-60">
                      (was {r.uncancelledGpa})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[0.68rem] opacity-60 uppercase font-semibold">Average Mark</span>
                <span className="font-mono font-semibold">
                  {r.averageMark !== null ? r.averageMark.toFixed(1) : "-"}
                </span>
              </div>
            </div>

            {r.failedSubjects.length > 0 && (
              <div className="text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-500/10 p-2 rounded-md border border-rose-500/20">
                Failed: {r.failedSubjects.join(", ")}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-base-300 bg-base-100 p-8 text-center text-sm opacity-60">
            No student matches these search parameters.
          </div>
        )}
      </div>

      {/* Desktop Data Table View (>= md) */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="table table-sm table-tight table-modern w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th className="w-12 font-semibold py-3 px-4">Status</th>
                {header("roll", "Roll")}
                {header("name", "Student")}
                <th className="font-semibold py-3 px-4">Class</th>
                {header("average", "Avg Mark", "text-right")}
                {header("gpa", "GPA", "text-right")}
                <th className="font-semibold py-3 px-4">Grade</th>
                <th className="font-semibold py-3 px-4">Audit Flags</th>
                <th className="font-semibold py-3 px-4">Cancelled by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {paginatedRows.map((r) => (
                <tr key={r.id} className="transition-colors duration-200 hover:bg-base-200/40">
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block size-2 rounded-full ${
                        r.passed ? "bg-emerald-500 status-dot-pulse" : "bg-rose-500"
                      }`}
                      title={r.passed ? "Clean Pass" : "Compulsory Fail"}
                    />
                  </td>
                  <td className="font-mono text-xs font-semibold opacity-85 text-base-content/85 py-3.5 px-4">#{r.roll}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-md bg-base-200/80 flex items-center justify-center font-bold text-xs text-base-content/80 shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <Link
                        href={`/students/${r.id}`}
                        className="font-bold text-base-content hover:text-primary transition-colors duration-200"
                      >
                        {r.name}
                      </Link>
                    </div>
                  </td>
                  <td className="text-xs opacity-90 text-base-content/90 py-3.5 px-4">{r.className}</td>
                  <td className="text-right font-mono text-xs font-medium py-3.5 px-4">
                    {r.averageMark !== null ? r.averageMark.toFixed(1) : "-"}
                  </td>
                  <td className="text-right font-mono text-xs py-3.5 px-4">
                    <span className="font-bold text-base-content">{r.gpa}</span>
                    {!r.passed && (
                      <span className="ml-1 text-[0.68rem] font-normal opacity-75 text-base-content/75">
                        (was {r.uncancelledGpa})
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <GradeBadge letter={r.letter} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {r.flags.optionalDidNotHelp && (
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20"
                          title="Optional grade point 2.00 or below: it added nothing"
                        >
                          opt
                        </span>
                      )}
                      {r.flags.practicalFail && (
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20"
                          title="Practical below the pass mark in at least one subject"
                        >
                          prac
                        </span>
                      )}
                      {r.flags.absent && (
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold bg-slate-500/10 text-slate-800 dark:text-slate-300 border border-slate-500/20"
                          title="Absent in at least one subject"
                        >
                          AB
                        </span>
                      )}
                      {!r.flags.optionalDidNotHelp &&
                        !r.flags.practicalFail &&
                        !r.flags.absent && (
                          <span className="text-xs opacity-50">-</span>
                        )}
                    </div>
                  </td>
                  <td className="text-xs opacity-90 py-3.5 px-4">
                    {r.failedSubjects.length > 0 ? (
                      <span className="font-semibold text-rose-700 dark:text-rose-300">
                        {r.failedSubjects.join(", ")}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-sm opacity-60">
                    No student matches these search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />
    </div>
  );
}
