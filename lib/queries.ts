import { cache } from "react";
import { db } from "./db";
import {
  evaluateStudent,
  type MarkRow,
  type StudentInput,
  type StudentResult,
  type SubjectDef,
} from "./grading";

export type ClassInfo = {
  id: number;
  code: string;
  name: string;
  groupName: string;
};

export type ResultSet = {
  classes: ClassInfo[];
  subjectsByClass: Map<number, SubjectDef[]>;
  results: StudentResult[];
};

type ClassRow = { id: number; code: string; name: string; group_name: string };
type SubjectRow = {
  id: number;
  class_id: number;
  code: string;
  name: string;
  is_optional: boolean;
  has_practical: boolean;
  theory_full: number;
  theory_pass: number;
  practical_full: number;
  practical_pass: number;
  ordinal: number;
};
type StudentRow = {
  id: number;
  class_id: number;
  roll: number;
  name: string;
  edge_case_note: string | null;
  class_name: string;
};
type MarkDbRow = {
  student_id: number;
  subject_id: number;
  theory_mark: number | null;
  practical_mark: number | null;
  is_absent: boolean;
};

/**
 * Reads every mark once and runs the whole cohort through the engine.
 *
 * Nothing derived is stored in the database: grade points, GPAs and the
 * checking lists are all recomputed here, so a correction to a mark can never
 * leave a stale result behind.
 */
export const getResultSet = cache(async (): Promise<ResultSet> => {
  const sql = db();

  const [classRows, subjectRows, studentRows, markRows] = (await Promise.all([
    sql`select id, code, name, group_name from classes order by id`,
    sql`select id, class_id, code, name, is_optional, has_practical,
               theory_full, theory_pass, practical_full, practical_pass, ordinal
        from subjects order by class_id, ordinal`,
    sql`select s.id, s.class_id, s.roll, s.name, s.edge_case_note, c.name as class_name
        from students s join classes c on c.id = s.class_id
        order by s.class_id, s.roll`,
    sql`select student_id, subject_id, theory_mark, practical_mark, is_absent
        from marks`,
  ])) as [ClassRow[], SubjectRow[], StudentRow[], MarkDbRow[]];

  const classes: ClassInfo[] = classRows.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    groupName: c.group_name,
  }));

  const subjectsByClass = new Map<number, SubjectDef[]>();
  for (const s of subjectRows) {
    const def: SubjectDef = {
      id: s.id,
      code: s.code,
      name: s.name,
      isOptional: s.is_optional,
      hasPractical: s.has_practical,
      theoryFull: s.theory_full,
      theoryPass: s.theory_pass,
      practicalFull: s.practical_full,
      practicalPass: s.practical_pass,
      ordinal: s.ordinal,
    };
    const list = subjectsByClass.get(s.class_id) ?? [];
    list.push(def);
    subjectsByClass.set(s.class_id, list);
  }

  const marksByStudent = new Map<number, MarkRow[]>();
  for (const m of markRows) {
    const list = marksByStudent.get(m.student_id) ?? [];
    list.push({
      subjectId: m.subject_id,
      theoryMark: m.theory_mark,
      practicalMark: m.practical_mark,
      isAbsent: m.is_absent,
    });
    marksByStudent.set(m.student_id, list);
  }

  const results = studentRows.map((row) => {
    const student: StudentInput = {
      id: row.id,
      roll: row.roll,
      name: row.name,
      className: row.class_name,
      classId: row.class_id,
      edgeCaseNote: row.edge_case_note,
    };
    return evaluateStudent(
      student,
      subjectsByClass.get(row.class_id) ?? [],
      marksByStudent.get(row.id) ?? [],
    );
  });

  return { classes, subjectsByClass, results };
});

export async function getStudentResult(
  id: number,
): Promise<StudentResult | undefined> {
  const { results } = await getResultSet();
  return results.find((r) => r.student.id === id);
}

/** R-29 -- the three lists the office checks by hand before results go out. */
export async function getCheckingLists() {
  const { results } = await getResultSet();
  return {
    optional: results.filter((r) => r.flags.optionalDidNotHelp),
    practicalFail: results.filter((r) => r.flags.practicalFail),
    absent: results.filter((r) => r.flags.absent),
    any: results.filter(
      (r) =>
        r.flags.optionalDidNotHelp || r.flags.practicalFail || r.flags.absent,
    ),
  };
}
