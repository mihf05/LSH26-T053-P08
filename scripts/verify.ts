/**
 * Checks the engine against every hard edge in the specification.
 *
 * The fixtures below are the same marks the seed writes for the hand written
 * edge case students, with the result worked out by hand. Run with:
 *
 *   npm run verify
 */
import assert from "node:assert/strict";
import {
  evaluateStudent,
  formatGpa,
  letterForGpa,
  type MarkRow,
  type SubjectDef,
} from "../lib/grading.ts";

const PRAC = {
  hasPractical: true,
  theoryFull: 75,
  theoryPass: 25,
  practicalFull: 25,
  practicalPass: 8,
};
const FULL = {
  hasPractical: false,
  theoryFull: 100,
  theoryPass: 33,
  practicalFull: 0,
  practicalPass: 0,
};

/** `practicalAt` lists the indexes of the compulsory subjects that have a practical part. */
function subjects(
  names: string[],
  optionalName: string,
  practicalAt: number[],
): SubjectDef[] {
  const defs = names.map((name, i) => ({
    id: i + 1,
    code: name.slice(0, 3).toUpperCase(),
    name,
    isOptional: false,
    ordinal: i + 1,
    ...(practicalAt.includes(i) ? PRAC : FULL),
  }));
  defs.push({
    id: names.length + 1,
    code: optionalName.slice(0, 3).toUpperCase(),
    name: optionalName,
    isOptional: true,
    ordinal: names.length + 1,
    ...PRAC,
  });
  return defs;
}

const SCIENCE = subjects(
  ["Bangla", "English", "Mathematics", "Physics", "Chemistry", "Biology"],
  "Higher Mathematics",
  [3, 4, 5],
);
const BUSINESS = subjects(
  [
    "Bangla",
    "English",
    "Mathematics",
    "Accounting",
    "Business Entrepreneurship",
    "ICT",
  ],
  "Agriculture Studies",
  [3, 5],
);

/** [theory, practical] or "AB", in subject order. */
type Sheet = (number | [number, number] | "AB")[];

function marks(sheet: Sheet): MarkRow[] {
  return sheet.map((m, i) => {
    const subjectId = i + 1;
    if (m === "AB")
      return {
        subjectId,
        theoryMark: null,
        practicalMark: null,
        isAbsent: true,
      };
    if (Array.isArray(m))
      return {
        subjectId,
        theoryMark: m[0],
        practicalMark: m[1],
        isAbsent: false,
      };
    return { subjectId, theoryMark: m, practicalMark: null, isAbsent: false };
  });
}

const student = (name: string) => ({
  id: 1,
  roll: 1,
  name,
  className: "Test",
  classId: 1,
  edgeCaseNote: null,
});

type Expectation = {
  name: string;
  subjects: SubjectDef[];
  sheet: Sheet;
  gpa: string;
  uncancelled: string;
  letter: string;
  passed: boolean;
  optionalBonus: number;
  flags?: Partial<{
    optionalDidNotHelp: boolean;
    practicalFail: boolean;
    absent: boolean;
  }>;
  /** Subjects that must be reported as the cause of a cancelled GPA. */
  cancelledBy?: string[];
  /** Rule id that must appear in the trace of the given subject index. */
  rulePrefix?: [number, string];
};

const CASES: Expectation[] = [
  {
    name: "One failed subject on a strong average",
    subjects: SCIENCE,
    sheet: [85, 82, 29, [62, 22], [60, 21], [58, 20], [60, 22]],
    gpa: "0.00",
    uncancelled: "4.50",
    letter: "F",
    passed: false,
    optionalBonus: 3,
    cancelledBy: ["Mathematics"],
    rulePrefix: [2, "R-11"],
  },
  {
    name: "Practical fail behind a passing theory mark",
    subjects: SCIENCE,
    sheet: [78, 74, 81, [58, 6], [55, 19], [54, 18], [52, 18]],
    gpa: "0.00",
    uncancelled: "3.83",
    letter: "F",
    passed: false,
    optionalBonus: 2,
    flags: { practicalFail: true },
    cancelledBy: ["Physics"],
    rulePrefix: [3, "R-11"],
  },
  {
    name: "Optional subject below the point where it helps",
    subjects: SCIENCE,
    sheet: [72, 68, 75, [52, 18], [50, 17], [55, 19], [30, 15]],
    gpa: "3.83",
    uncancelled: "3.83",
    letter: "A-",
    passed: true,
    optionalBonus: 0,
    flags: { optionalDidNotHelp: true },
  },
  {
    name: "Absent in a compulsory subject",
    subjects: SCIENCE,
    sheet: [88, 79, 84, [63, 23], "AB", [61, 21], [58, 20]],
    gpa: "0.00",
    uncancelled: "4.33",
    letter: "F",
    passed: false,
    optionalBonus: 2,
    flags: { absent: true },
    cancelledBy: ["Chemistry"],
    rulePrefix: [4, "R-12"],
  },
  {
    name: "Absent in the optional subject",
    subjects: SCIENCE,
    sheet: [76, 71, 69, [51, 17], [49, 16], [53, 18], "AB"],
    gpa: "3.75",
    uncancelled: "3.75",
    letter: "A-",
    passed: true,
    optionalBonus: 0,
    flags: { absent: true, optionalDidNotHelp: true },
  },
  {
    name: "GPA capped at 5.00",
    subjects: SCIENCE,
    sheet: [92, 86, 95, [68, 24], [66, 23], [67, 24], [65, 23]],
    gpa: "5.00",
    uncancelled: "5.00",
    letter: "A+",
    passed: true,
    optionalBonus: 3,
  },
  {
    name: "Exactly on both pass marks (theory 25, practical 8)",
    subjects: BUSINESS,
    sheet: [62, 58, 55, [25, 8], 64, [48, 17], [45, 16]],
    gpa: "3.17",
    uncancelled: "3.17",
    letter: "B",
    passed: true,
    optionalBonus: 1.5,
    rulePrefix: [3, "R-10"],
  },
  {
    name: "Practical one mark short of the pass mark",
    subjects: BUSINESS,
    sheet: [81, 77, 79, [60, 21], 74, [70, 7], [56, 19]],
    gpa: "0.00",
    uncancelled: "4.00",
    letter: "F",
    passed: false,
    optionalBonus: 2,
    flags: { practicalFail: true },
    cancelledBy: ["ICT"],
  },
  {
    name: "Optional grade point 1.00 still goes on the list",
    subjects: BUSINESS,
    sheet: [69, 63, 58, [47, 16], 66, [45, 15], [26, 10]],
    gpa: "3.42",
    uncancelled: "3.42",
    letter: "B",
    passed: true,
    optionalBonus: 0,
    flags: { optionalDidNotHelp: true },
  },
  {
    name: "On all three checking lists at once",
    subjects: BUSINESS,
    sheet: [73, 67, 71, [55, 5], 70, [52, 18], "AB"],
    gpa: "0.00",
    uncancelled: "3.25",
    letter: "F",
    passed: false,
    optionalBonus: 0,
    flags: { optionalDidNotHelp: true, practicalFail: true, absent: true },
    cancelledBy: ["Accounting"],
  },
];

let checks = 0;
const check = (fn: () => void) => {
  fn();
  checks++;
};

for (const c of CASES) {
  const r = evaluateStudent(student(c.name), c.subjects, marks(c.sheet));
  const where = `[${c.name}]`;

  check(() => assert.equal(formatGpa(r.gpa), c.gpa, `${where} final GPA`));
  check(() =>
    assert.equal(
      formatGpa(r.uncancelledGpa),
      c.uncancelled,
      `${where} uncancelled GPA`,
    ),
  );
  check(() => assert.equal(r.letter, c.letter, `${where} letter grade`));
  check(() => assert.equal(r.passed, c.passed, `${where} passed`));
  check(() =>
    assert.equal(r.optionalBonus, c.optionalBonus, `${where} optional bonus`),
  );

  for (const [flag, expected] of Object.entries(c.flags ?? {})) {
    check(() =>
      assert.equal(
        r.flags[flag as keyof typeof r.flags],
        expected,
        `${where} flag ${flag}`,
      ),
    );
  }

  if (c.cancelledBy) {
    check(() =>
      assert.deepEqual(
        r.failedCompulsory.map((s) => s.subject.name),
        c.cancelledBy,
        `${where} subject that cancelled the GPA`,
      ),
    );
  }

  if (c.rulePrefix) {
    const [index, rule] = c.rulePrefix;
    const all = r.optional ? [...r.compulsory, r.optional] : r.compulsory;
    check(() =>
      assert.ok(
        all[index].rule.startsWith(rule),
        `${where} subject ${index} should be decided by ${rule}, got: ${all[index].rule}`,
      ),
    );
  }

  // A cancelled GPA must never hide the uncancelled figure (R-13).
  if (!c.passed) {
    check(() =>
      assert.ok(r.uncancelledGpa > 0, `${where} uncancelled GPA stays visible`),
    );
    check(() =>
      assert.ok(
        r.impacts.some((i) => i.includes("Uncancelled GPA")),
        `${where} trace explains the cancellation`,
      ),
    );
  }
}

/* Letter grade boundaries (R-10). */
const BOUNDARIES: [number, string][] = [
  [5.0, "A+"],
  [4.99, "A"],
  [4.0, "A"],
  [3.99, "A-"],
  [3.5, "A-"],
  [3.49, "B"],
  [3.0, "B"],
  [2.99, "C"],
  [2.0, "C"],
  [1.99, "D"],
  [1.0, "D"],
  [0.99, "F"],
  [0, "F"],
];
for (const [gpa, letter] of BOUNDARIES) {
  check(() =>
    assert.equal(letterForGpa(gpa), letter, `letter grade for GPA ${gpa}`),
  );
}

console.log(`OK -- ${CASES.length} edge cases, ${checks} assertions passed.`);
