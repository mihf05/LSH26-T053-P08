/**
 * School Result Processing and GPA Engine
 * ---------------------------------------
 * Pure, dependency-free implementation of the marking rules. Every function
 * here is deterministic so that the same marks always produce the same
 * result, and every decision carries the id of the rule that made it.
 *
 * Rule ids used in traces:
 *   R-10  mark -> grade point table, and GPA -> letter grade table
 *   R-11  theory 25/75 and practical 8/25 pass marks; failing either part
 *         fails the whole subject with grade point 0
 *   R-12  absence handling (AB) for compulsory and optional subjects
 *   R-13  GPA formula, the 5.00 cap, and the compulsory-failure override
 *   R-29  the three office checking lists
 */

export type SubjectDef = {
  id: number;
  code: string;
  name: string;
  isOptional: boolean;
  hasPractical: boolean;
  theoryFull: number;
  theoryPass: number;
  practicalFull: number;
  practicalPass: number;
  ordinal: number;
};

export type MarkRow = {
  subjectId: number;
  theoryMark: number | null;
  practicalMark: number | null;
  isAbsent: boolean;
};

export type SubjectStatus =
  | "absent"
  | "theory_fail"
  | "practical_fail"
  | "total_fail"
  | "pass";

export type SubjectResult = {
  subject: SubjectDef;
  isAbsent: boolean;
  theoryMark: number | null;
  practicalMark: number | null;
  /** Total out of 100, or null when the student was absent. */
  total: number | null;
  /** What the mark sheet prints in the "mark used" column: "AB" or "72 (55+17)". */
  displayMark: string;
  gradePoint: number;
  letter: string;
  status: SubjectStatus;
  /** Human readable reason, prefixed with the rule id that decided it. */
  rule: string;
};

export type StudentInput = {
  id: number;
  roll: number;
  name: string;
  className: string;
  classId: number;
  edgeCaseNote: string | null;
};

export type StudentResult = {
  student: StudentInput;
  compulsory: SubjectResult[];
  optional: SubjectResult | null;
  /** Sum of the six compulsory grade points. */
  compulsorySum: number;
  optionalGradePoint: number;
  /** max(0, optional grade point - 2) -- the part that actually helps. */
  optionalBonus: number;
  /** GPA before the compulsory-failure override, capped at 5.00 (R-13). */
  uncancelledGpa: number;
  /** Plain average of subject marks out of 100, ignoring every pass rule. */
  averageMark: number | null;
  gpa: number;
  letter: string;
  passed: boolean;
  /** Compulsory subjects that scored 0 and therefore cancelled the GPA. */
  failedCompulsory: SubjectResult[];
  /** Subjects (any kind) where the practical part was below the pass mark. */
  practicalFailures: SubjectResult[];
  /** Subjects (any kind) marked absent. */
  absences: SubjectResult[];
  flags: {
    optionalDidNotHelp: boolean;
    practicalFail: boolean;
    absent: boolean;
  };
  /** One line per rule that changed the printed result, for the office lists. */
  impacts: string[];
};

/* ------------------------------------------------------------------ */
/* R-10  mark -> grade point                                           */
/* ------------------------------------------------------------------ */

export const GRADE_TABLE: {
  min: number;
  max: number;
  point: number;
  letter: string;
}[] = [
  { min: 80, max: 100, point: 5.0, letter: "A+" },
  { min: 70, max: 79, point: 4.0, letter: "A" },
  { min: 60, max: 69, point: 3.5, letter: "A-" },
  { min: 50, max: 59, point: 3.0, letter: "B" },
  { min: 40, max: 49, point: 2.0, letter: "C" },
  { min: 33, max: 39, point: 1.0, letter: "D" },
  { min: 0, max: 32, point: 0.0, letter: "F" },
];

/** Subject grade point from a total out of 100 (R-10). */
export function gradePointForTotal(total: number): {
  point: number;
  letter: string;
  band: string;
} {
  const row = GRADE_TABLE.find((r) => total >= r.min && total <= r.max)!;
  return {
    point: row.point,
    letter: row.letter,
    band: `${row.min}-${row.max}`,
  };
}

/* ------------------------------------------------------------------ */
/* R-10  GPA -> letter grade                                           */
/* ------------------------------------------------------------------ */

export const GPA_LETTER_TABLE: {
  min: number;
  max: number;
  letter: string;
}[] = [
  { min: 5.0, max: 5.0, letter: "A+" },
  { min: 4.0, max: 4.99, letter: "A" },
  { min: 3.5, max: 3.99, letter: "A-" },
  { min: 3.0, max: 3.49, letter: "B" },
  { min: 2.0, max: 2.99, letter: "C" },
  { min: 1.0, max: 1.99, letter: "D" },
];

/** Letter grade for a final GPA already rounded to 2 decimal places (R-10). */
export function letterForGpa(gpa: number): string {
  const row = GPA_LETTER_TABLE.find((r) => gpa >= r.min && gpa <= r.max);
  return row ? row.letter : "F";
}

/** Round half up to 2 decimal places, the way a mark sheet prints a GPA. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatGpa(value: number): string {
  return round2(value).toFixed(2);
}

/* ------------------------------------------------------------------ */
/* R-11 / R-12  one subject                                            */
/* ------------------------------------------------------------------ */

export function evaluateSubject(
  subject: SubjectDef,
  mark: MarkRow | undefined,
): SubjectResult {
  const base = {
    subject,
    theoryMark: mark?.theoryMark ?? null,
    practicalMark: mark?.practicalMark ?? null,
  };

  // R-12 -- absent. The subject scores 0 whether it is compulsory or optional;
  // the difference in treatment happens at the GPA level, not here.
  if (!mark || mark.isAbsent) {
    return {
      ...base,
      isAbsent: true,
      theoryMark: null,
      practicalMark: null,
      total: null,
      displayMark: "AB",
      gradePoint: 0,
      letter: "F",
      status: "absent",
      rule: subject.isOptional
        ? "R-12 absent in the optional subject: contributes 0, student goes on the checking list"
        : "R-12 absent in a compulsory subject: AB, grade point 0, overall result F",
    };
  }

  const theory = mark.theoryMark ?? 0;
  const practical = subject.hasPractical ? (mark.practicalMark ?? 0) : 0;
  const total = theory + practical;
  const displayMark = subject.hasPractical
    ? `${total} (${theory}T + ${practical}P)`
    : `${total}`;

  // R-11 -- the theory part must reach its own pass mark.
  if (theory < subject.theoryPass) {
    return {
      ...base,
      isAbsent: false,
      total,
      displayMark,
      gradePoint: 0,
      letter: "F",
      status: "theory_fail",
      rule: `R-11 theory ${theory}/${subject.theoryFull} is below the pass mark ${subject.theoryPass}: subject fails, grade point 0`,
    };
  }

  // R-11 -- so must the practical part, even when the theory mark passes.
  if (subject.hasPractical && practical < subject.practicalPass) {
    return {
      ...base,
      isAbsent: false,
      total,
      displayMark,
      gradePoint: 0,
      letter: "F",
      status: "practical_fail",
      rule: `R-11 practical ${practical}/${subject.practicalFull} is below the pass mark ${subject.practicalPass} (theory ${theory}/${subject.theoryFull} passed): subject fails, grade point 0`,
    };
  }

  const { point, letter, band } = gradePointForTotal(total);

  if (point === 0) {
    return {
      ...base,
      isAbsent: false,
      total,
      displayMark,
      gradePoint: 0,
      letter: "F",
      status: "total_fail",
      rule: `R-10 total ${total}/100 falls in the ${band} band: grade point 0.00, F`,
    };
  }

  return {
    ...base,
    isAbsent: false,
    total,
    displayMark,
    gradePoint: point,
    letter,
    status: "pass",
    rule: `R-10 total ${total}/100 falls in the ${band} band: grade point ${point.toFixed(2)}, ${letter}`,
  };
}

/* ------------------------------------------------------------------ */
/* R-13  the whole student                                             */
/* ------------------------------------------------------------------ */

export function evaluateStudent(
  student: StudentInput,
  subjects: SubjectDef[],
  marks: MarkRow[],
): StudentResult {
  const byId = new Map(marks.map((m) => [m.subjectId, m]));
  const ordered = [...subjects].sort((a, b) => a.ordinal - b.ordinal);

  const compulsory = ordered
    .filter((s) => !s.isOptional)
    .map((s) => evaluateSubject(s, byId.get(s.id)));
  const optionalDef = ordered.find((s) => s.isOptional);
  const optional = optionalDef
    ? evaluateSubject(optionalDef, byId.get(optionalDef.id))
    : null;

  const compulsorySum = compulsory.reduce((sum, r) => sum + r.gradePoint, 0);
  const optionalGradePoint = optional?.gradePoint ?? 0;
  const optionalBonus = Math.max(0, optionalGradePoint - 2);

  // R-13 -- (compulsory grade points + max(0, optional - 2)) / 6, capped at 5.00.
  const uncancelledGpa = round2(
    Math.min(5, (compulsorySum + optionalBonus) / 6),
  );

  const scored = [...compulsory, optional]
    .filter((r): r is SubjectResult => !!r && r.total !== null)
    .map((r) => r.total!);
  const averageMark =
    scored.length > 0
      ? round2(scored.reduce((a, b) => a + b, 0) / scored.length)
      : null;

  // R-13 -- any compulsory failure (a fail or an absence) cancels the GPA.
  const failedCompulsory = compulsory.filter((r) => r.gradePoint === 0);
  const passed = failedCompulsory.length === 0;
  const gpa = passed ? uncancelledGpa : 0;
  const letter = passed ? letterForGpa(gpa) : "F";

  const all = optional ? [...compulsory, optional] : compulsory;
  const practicalFailures = all.filter((r) => r.status === "practical_fail");
  const absences = all.filter((r) => r.isAbsent);

  // R-29 -- the three office checking lists.
  const flags = {
    optionalDidNotHelp: !!optional && optionalGradePoint <= 2.0,
    practicalFail: practicalFailures.length > 0,
    absent: absences.length > 0,
  };

  const impacts: string[] = [];
  if (flags.optionalDidNotHelp && optional) {
    impacts.push(
      optional.isAbsent
        ? `Optional ${optional.subject.name} is AB, so it adds 0 to the GPA (R-12, R-29).`
        : `Optional ${optional.subject.name} scored ${optionalGradePoint.toFixed(2)}, at or below 2.00, so max(0, ${optionalGradePoint.toFixed(2)} - 2) = 0.00 was added (R-13, R-29).`,
    );
  }
  for (const r of practicalFailures) {
    impacts.push(
      `${r.subject.name}: practical ${r.practicalMark}/${r.subject.practicalFull} is below ${r.subject.practicalPass}, so the subject scored 0 even though theory ${r.theoryMark}/${r.subject.theoryFull} passed (R-11).`,
    );
  }
  for (const r of absences) {
    impacts.push(
      r.subject.isOptional
        ? `Absent in the optional subject ${r.subject.name}: AB, contributes 0 (R-12).`
        : `Absent in the compulsory subject ${r.subject.name}: AB, grade point 0, overall result F (R-12).`,
    );
  }
  if (!passed) {
    impacts.push(
      `GPA cancelled to 0.00 by ${failedCompulsory.length} compulsory failure(s): ${failedCompulsory
        .map((r) => r.subject.name)
        .join(", ")}. Uncancelled GPA was ${formatGpa(uncancelledGpa)} (R-13).`,
    );
  }

  return {
    student,
    compulsory,
    optional,
    compulsorySum: round2(compulsorySum),
    optionalGradePoint,
    optionalBonus: round2(optionalBonus),
    uncancelledGpa,
    averageMark,
    gpa,
    letter,
    passed,
    failedCompulsory,
    practicalFailures,
    absences,
    flags,
    impacts,
  };
}

/** The GPA arithmetic spelled out, for the calculation trace. */
export function gpaWorkings(result: StudentResult): string {
  const parts = result.compulsory
    .map((r) => r.gradePoint.toFixed(2))
    .join(" + ");
  const raw = (result.compulsorySum + result.optionalBonus) / 6;
  const capped = raw > 5;
  return [
    `(${parts}) = ${result.compulsorySum.toFixed(2)}`,
    `optional bonus = max(0, ${result.optionalGradePoint.toFixed(2)} - 2) = ${result.optionalBonus.toFixed(2)}`,
    `(${result.compulsorySum.toFixed(2)} + ${result.optionalBonus.toFixed(2)}) / 6 = ${formatGpa(raw)}`,
    capped ? `capped at 5.00 (R-13)` : null,
    result.passed
      ? `final GPA ${formatGpa(result.gpa)}, letter ${result.letter}`
      : `compulsory failure: final GPA 0.00, letter F (uncancelled ${formatGpa(result.uncancelledGpa)} kept visible, R-13)`,
  ]
    .filter(Boolean)
    .join("\n");
}
