"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GradeBadge } from "@/components/GradeBadge";

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

  const header = (key: SortKey, label: string, align = "") => (
    <th className={align}>
      <button
        type="button"
        className="link link-hover inline-flex items-center gap-1"
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
          <span className="text-[0.6rem]">{desc ? "▼" : "▲"}</span>
        )}
      </button>
    </th>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-2 no-print">
        <label className="form-control">
          <span className="label-text text-xs">Search</span>
          <input
            className="input input-sm input-bordered w-56"
            placeholder="Name or roll"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="form-control">
          <span className="label-text text-xs">Class</span>
          <select
            className="select select-sm select-bordered"
            value={classId}
            onChange={(e) =>
              setClassId(
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
        </label>
        <label className="form-control">
          <span className="label-text text-xs">Result</span>
          <select
            className="select select-sm select-bordered"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as typeof outcome)}
          >
            <option value="all">Passed and failed</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
        </label>
        <label className="form-control">
          <span className="label-text text-xs">Checking list</span>
          <select
            className="select select-sm select-bordered"
            value={flag}
            onChange={(e) => setFlag(e.target.value as typeof flag)}
          >
            <option value="all">Any</option>
            <option value="optional">Optional did not help</option>
            <option value="practical">Practical fail</option>
            <option value="absent">Absent</option>
          </select>
        </label>
        <span className="ml-auto text-sm opacity-60">
          {filtered.length} of {rows.length} students
        </span>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table table-sm table-tight table-pin-rows">
          <thead>
            <tr>
              {header("roll", "Roll")}
              {header("name", "Student")}
              <th>Class</th>
              {header("average", "Average mark", "text-right")}
              {header("gpa", "GPA", "text-right")}
              <th>Grade</th>
              <th>Flags</th>
              <th>Cancelled by</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="hover">
                <td className="font-mono text-xs opacity-70">{r.roll}</td>
                <td>
                  <Link
                    href={`/students/${r.id}`}
                    className="link link-hover font-medium"
                  >
                    {r.name}
                  </Link>
                </td>
                <td className="text-xs opacity-70">{r.className}</td>
                <td className="text-right font-mono text-xs">
                  {r.averageMark !== null ? r.averageMark.toFixed(1) : "-"}
                </td>
                <td className="text-right font-mono font-semibold">
                  {r.gpa}
                  {!r.passed && (
                    <span className="ml-1 text-[0.65rem] font-normal opacity-60">
                      (was {r.uncancelledGpa})
                    </span>
                  )}
                </td>
                <td>
                  <GradeBadge letter={r.letter} />
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {r.flags.optionalDidNotHelp && (
                      <span
                        className="badge badge-xs badge-warning badge-outline"
                        title="Optional grade point 2.00 or below: it added nothing"
                      >
                        opt
                      </span>
                    )}
                    {r.flags.practicalFail && (
                      <span
                        className="badge badge-xs badge-error badge-outline"
                        title="Practical below the pass mark in at least one subject"
                      >
                        prac
                      </span>
                    )}
                    {r.flags.absent && (
                      <span
                        className="badge badge-xs badge-neutral"
                        title="Absent in at least one subject"
                      >
                        AB
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-xs opacity-75">
                  {r.failedSubjects.length > 0
                    ? r.failedSubjects.join(", ")
                    : "-"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm opacity-60">
                  No student matches these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
