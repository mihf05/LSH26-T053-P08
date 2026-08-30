/**
 * Seeds the Neon database with two classes, 64 students and their marks.
 *
 * The data is generated from a fixed PRNG seed, so re-running the seed always
 * produces exactly the same mark sheet. The first six rolls of the Science
 * class and the first four rolls of the Business class are hand written edge
 * cases -- they are the ones the checking lists and the traces have to get
 * right. Everything else is generated around them so the lists have volume.
 *
 * Usage:  node scripts/seed.mjs
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import pg from "pg";

/* ---------------- env ---------------- */

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      for (const line of readFileSync(file, "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
        }
      }
    } catch {
      /* file is optional */
    }
  }
}
loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;

/* ---------------- deterministic PRNG ---------------- */

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260830);
const between = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

/* ---------------- reference data ---------------- */

const PRAC = { hasPractical: true, theoryFull: 75, theoryPass: 25, practicalFull: 25, practicalPass: 8 };
const FULL = { hasPractical: false, theoryFull: 100, theoryPass: 33, practicalFull: 0, practicalPass: 0 };

const CLASSES = [
  {
    code: "SCI",
    name: "Class 10 - Science",
    group: "Science",
    subjects: [
      { code: "BAN", name: "Bangla", ...FULL },
      { code: "ENG", name: "English", ...FULL },
      { code: "MAT", name: "Mathematics", ...FULL },
      { code: "PHY", name: "Physics", ...PRAC },
      { code: "CHE", name: "Chemistry", ...PRAC },
      { code: "BIO", name: "Biology", ...PRAC },
      { code: "HMT", name: "Higher Mathematics", isOptional: true, ...PRAC },
    ],
  },
  {
    code: "BUS",
    name: "Class 10 - Business Studies",
    group: "Business Studies",
    subjects: [
      { code: "BAN", name: "Bangla", ...FULL },
      { code: "ENG", name: "English", ...FULL },
      { code: "MAT", name: "Mathematics", ...FULL },
      { code: "ACC", name: "Accounting", ...PRAC },
      { code: "BEN", name: "Business Entrepreneurship", ...FULL },
      { code: "ICT", name: "Information and Communication Technology", ...PRAC },
      { code: "AGR", name: "Agriculture Studies", isOptional: true, ...PRAC },
    ],
  },
];

const FIRST = [
  "Ayesha","Rafiq","Nusrat","Tanvir","Sadia","Imran","Farhana","Shakib","Mehjabin","Arif",
  "Sumaiya","Zubair","Tasnim","Rakib","Nabila","Hasan","Ruponti","Mahmud","Jarin","Sabbir",
  "Anika","Fahim","Lamia","Rasel","Ishrat","Naeem","Tahmina","Sohel","Mim","Ridwan",
  "Priya","Jubayer","Sanjida","Omar","Rithika","Shafin","Maliha","Tousif","Nazia","Ashraf",
];
const LAST = [
  "Rahman","Islam","Chowdhury","Akter","Hossain","Karim","Sultana","Ahmed","Bhuiyan","Talukder",
  "Siddique","Mollah","Haque","Jahan","Sarker","Mridha","Khatun","Uddin","Barua","Das",
];

const usedNames = new Set();
function makeName() {
  for (let i = 0; i < 500; i++) {
    const n = `${pick(FIRST)} ${pick(LAST)}`;
    if (!usedNames.has(n)) {
      usedNames.add(n);
      return n;
    }
  }
  throw new Error("ran out of names");
}

/* ---------------- mark helpers ---------------- */

const AB = { absent: true };
/** Split a target total out of 100 into a 75-mark theory and a 25-mark practical. */
function split(total) {
  let p = clamp(Math.round(total * 0.25) + between(-3, 3), 0, 25);
  let t = clamp(total - p, 0, 75);
  p = total - t;
  if (p > 25) {
    p = 25;
    t = total - 25;
  }
  return { theory: t, practical: p };
}
/** A mark for one subject aiming at `total` out of 100. */
function marksFor(subject, total) {
  if (!subject.hasPractical) return { theory: clamp(total, 0, 100), practical: null };
  return split(clamp(total, 0, 100));
}

/* ---------------- hand written edge cases ---------------- */
// Each entry maps subject code -> either a total out of 100, an explicit
// { theory, practical } pair, or AB.

const EDGE_CASES = {
  SCI: [
    {
      name: "Nusrat Jahan Oishee",
      note: "One failed compulsory subject on a strong average: Mathematics 29/100 fails while every other subject is an A or A+, so the GPA is cancelled to 0.00.",
      marks: { BAN: 85, ENG: 82, MAT: 29, PHY: { theory: 62, practical: 22 }, CHE: { theory: 60, practical: 21 }, BIO: { theory: 58, practical: 20 }, HMT: { theory: 60, practical: 22 } },
    },
    {
      name: "Tanvir Ahmed Joy",
      note: "Practical fail with a passing theory mark: Physics theory 58/75 passes but practical 6/25 is below 8, so the subject scores 0 and cancels the GPA.",
      marks: { BAN: 78, ENG: 74, MAT: 81, PHY: { theory: 58, practical: 6 }, CHE: { theory: 55, practical: 19 }, BIO: { theory: 54, practical: 18 }, HMT: { theory: 52, practical: 18 } },
    },
    {
      name: "Sadia Islam Mim",
      note: "Optional subject below the point where it helps: Higher Mathematics totals 45, grade point 2.00, so max(0, 2.00 - 2) adds nothing to the GPA.",
      marks: { BAN: 72, ENG: 68, MAT: 75, PHY: { theory: 52, practical: 18 }, CHE: { theory: 50, practical: 17 }, BIO: { theory: 55, practical: 19 }, HMT: { theory: 30, practical: 15 } },
    },
    {
      name: "Imran Hossain Nabil",
      note: "Absent in a compulsory subject: Chemistry is AB, so it is grade point 0 and the overall result is F however good the rest is.",
      marks: { BAN: 88, ENG: 79, MAT: 84, PHY: { theory: 63, practical: 23 }, CHE: AB, BIO: { theory: 61, practical: 21 }, HMT: { theory: 58, practical: 20 } },
    },
    {
      name: "Farhana Akter Setu",
      note: "Absent in the optional subject: Higher Mathematics is AB, contributes 0, every compulsory subject passes, so the student still gets a GPA and goes on the checking list.",
      marks: { BAN: 76, ENG: 71, MAT: 69, PHY: { theory: 51, practical: 17 }, CHE: { theory: 49, practical: 16 }, BIO: { theory: 53, practical: 18 }, HMT: AB },
    },
    {
      name: "Shakib Al Mahmud",
      note: "GPA cap: six A+ compulsory subjects give 30.00 and the optional adds 3.00, so 33.00 / 6 = 5.50 is capped at 5.00.",
      marks: { BAN: 92, ENG: 86, MAT: 95, PHY: { theory: 68, practical: 24 }, CHE: { theory: 66, practical: 23 }, BIO: { theory: 67, practical: 24 }, HMT: { theory: 65, practical: 23 } },
    },
  ],
  BUS: [
    {
      name: "Mehjabin Rahman Tisha",
      note: "Exactly on both pass marks: Accounting theory 25/75 and practical 8/25 are the lowest passing marks there are, giving a total of 33 and grade point 1.00.",
      marks: { BAN: 62, ENG: 58, MAT: 55, ACC: { theory: 25, practical: 8 }, BEN: 64, ICT: { theory: 48, practical: 17 }, AGR: { theory: 45, practical: 16 } },
    },
    {
      name: "Rakib Uddin Sourav",
      note: "Practical one mark short: ICT theory 70/75 is excellent but practical 7/25 misses the pass mark by one, so the subject scores 0.",
      marks: { BAN: 81, ENG: 77, MAT: 79, ACC: { theory: 60, practical: 21 }, BEN: 74, ICT: { theory: 70, practical: 7 }, AGR: { theory: 56, practical: 19 } },
    },
    {
      name: "Jarin Tasnim Ela",
      note: "Optional subject grade point 1.00: Agriculture Studies totals 36, so it is on the optional checking list even though it did pass.",
      marks: { BAN: 69, ENG: 63, MAT: 58, ACC: { theory: 47, practical: 16 }, BEN: 66, ICT: { theory: 45, practical: 15 }, AGR: { theory: 26, practical: 10 } },
    },
    {
      name: "Sabbir Hasan Rifat",
      note: "On all three checking lists at once: absent in the optional subject, a practical fail in Accounting, and the absence itself.",
      marks: { BAN: 73, ENG: 67, MAT: 71, ACC: { theory: 55, practical: 5 }, BEN: 70, ICT: { theory: 52, practical: 18 }, AGR: AB },
    },
  ],
};

/* ---------------- generated students ---------------- */

const TIERS = [
  { lo: 80, hi: 96, w: 18 }, // A+
  { lo: 70, hi: 79, w: 22 }, // A
  { lo: 60, hi: 69, w: 22 }, // A-
  { lo: 50, hi: 59, w: 18 }, // B
  { lo: 40, hi: 49, w: 12 }, // C
  { lo: 33, hi: 39, w: 8 },  // D
];
function tierTotal() {
  const total = TIERS.reduce((s, t) => s + t.w, 0);
  let r = rnd() * total;
  for (const t of TIERS) {
    r -= t.w;
    if (r <= 0) return between(t.lo, t.hi);
  }
  return between(50, 59);
}

function generatedStudent(cls) {
  const marks = {};
  const compulsory = cls.subjects.filter((s) => !s.isOptional);
  const optional = cls.subjects.find((s) => s.isOptional);

  // A base ability so a student's subjects hang together instead of being noise.
  const base = tierTotal();
  for (const s of compulsory) {
    marks[s.code] = clamp(base + between(-9, 9), 30, 98);
  }

  const roll = rnd();
  if (roll < 0.05) {
    // absent in one compulsory subject
    marks[pick(compulsory).code] = AB;
  } else if (roll < 0.13) {
    // practical fail behind a passing theory mark
    const withPractical = compulsory.filter((s) => s.hasPractical);
    const s = pick(withPractical);
    marks[s.code] = { theory: between(34, 66), practical: between(2, 7) };
  } else if (roll < 0.20) {
    // a plain theory fail
    const s = pick(compulsory);
    marks[s.code] = s.hasPractical
      ? { theory: between(12, 24), practical: between(9, 22) }
      : between(14, 32);
  }

  const optRoll = rnd();
  if (optRoll < 0.04) marks[optional.code] = AB;
  else if (optRoll < 0.22) marks[optional.code] = between(33, 49); // grade point 1 or 2
  else marks[optional.code] = clamp(base + between(-12, 8), 30, 96);

  return { name: makeName(), note: null, marks };
}

/* ---------------- build the roster ---------------- */

const STUDENTS_PER_CLASS = 32;

function buildRoster(cls) {
  const edges = EDGE_CASES[cls.code];
  edges.forEach((e) => usedNames.add(e.name));
  const rest = Array.from({ length: STUDENTS_PER_CLASS - edges.length }, () =>
    generatedStudent(cls),
  );
  return [...edges, ...rest].map((s, i) => ({ ...s, roll: i + 1 }));
}

/* ---------------- build the SQL ---------------- */

const q = (v) =>
  v === null || v === undefined
    ? "null"
    : typeof v === "number"
      ? String(v)
      : typeof v === "boolean"
        ? String(v)
        : `'${String(v).replace(/'/g, "''")}'`;

/** Every insert, with explicit ids so the seed is byte for byte reproducible. */
function buildInserts() {
  const statements = [];
  const classRows = [];
  const subjectRows = [];
  const studentRows = [];
  const markRows = [];

  let classId = 0;
  let subjectId = 0;
  let studentId = 0;

  for (const cls of CLASSES) {
    classId++;
    classRows.push(`(${classId}, ${q(cls.code)}, ${q(cls.name)}, ${q(cls.group)})`);

    const subjectIds = {};
    for (const [i, s] of cls.subjects.entries()) {
      subjectId++;
      subjectIds[s.code] = subjectId;
      subjectRows.push(
        `(${subjectId}, ${classId}, ${q(s.code)}, ${q(s.name)}, ${q(!!s.isOptional)}, ${q(s.hasPractical)}, ${s.theoryFull}, ${s.theoryPass}, ${s.practicalFull}, ${s.practicalPass}, ${i + 1})`,
      );
    }

    for (const st of buildRoster(cls)) {
      studentId++;
      studentRows.push(
        `(${studentId}, ${classId}, ${st.roll}, ${q(st.name)}, ${q(st.note)})`,
      );

      for (const subject of cls.subjects) {
        const raw = st.marks[subject.code];
        let theory = null;
        let practical = null;
        let absent = false;

        if (raw === AB || (raw && raw.absent)) {
          absent = true;
        } else if (typeof raw === "number") {
          const m = marksFor(subject, raw);
          theory = m.theory;
          practical = m.practical;
        } else {
          theory = raw.theory;
          practical = subject.hasPractical ? raw.practical : null;
        }

        markRows.push(
          `(${studentId}, ${subjectIds[subject.code]}, ${q(theory)}, ${q(practical)}, ${q(absent)})`,
        );
      }
    }
  }

  const chunk = (rows, size) => {
    const out = [];
    for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
    return out;
  };

  statements.push(
    `insert into classes (id, code, name, group_name) values ${classRows.join(", ")}`,
  );
  statements.push(
    `insert into subjects (id, class_id, code, name, is_optional, has_practical, theory_full, theory_pass, practical_full, practical_pass, ordinal) values ${subjectRows.join(", ")}`,
  );
  for (const part of chunk(studentRows, 32)) {
    statements.push(
      `insert into students (id, class_id, roll, name, edge_case_note) values ${part.join(", ")}`,
    );
  }
  for (const part of chunk(markRows, 112)) {
    statements.push(
      `insert into marks (student_id, subject_id, theory_mark, practical_mark, is_absent) values ${part.join(", ")}`,
    );
  }

  // Keep the sequences ahead of the explicit ids we just inserted.
  statements.push(`select setval('classes_id_seq', ${classId})`);
  statements.push(`select setval('subjects_id_seq', ${subjectId})`);
  statements.push(`select setval('students_id_seq', ${studentId})`);
  statements.push(
    `select setval('marks_id_seq', (select coalesce(max(id), 1) from marks))`,
  );

  return { statements, classId, subjectId, studentId, markRows: markRows.length };
}

/* ---------------- run ---------------- */

function schemaStatements() {
  return readFileSync("db/schema.sql", "utf8")
    .split(/;\s*\n/)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
}

async function main() {
  const built = buildInserts();
  const all = [...schemaStatements(), ...built.statements];

  // `--sql` prints the whole seed instead of executing it. Useful when the
  // machine running the seed cannot reach the database directly.
  if (process.argv.includes("--sql")) {
    process.stdout.write(all.map((s) => s + ";").join("\n") + "\n");
    return;
  }

  if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set (put it in .env.local).");
    process.exit(1);
  }

  // Neon over HTTP for neon.tech, node-postgres for a local server -- the same
  // split the app itself makes in lib/db.ts.
  let run;
  let close = async () => {};
  if (new URL(DATABASE_URL).hostname.endsWith(".neon.tech")) {
    const sql = neon(DATABASE_URL);
    run = (stmt) => sql.query(stmt);
  } else {
    const pool = new pg.Pool({ connectionString: DATABASE_URL });
    run = (stmt) => pool.query(stmt);
    close = () => pool.end();
  }

  console.log("Applying schema...");
  for (const stmt of schemaStatements()) await run(stmt);
  console.log("Inserting classes, subjects, students and marks...");
  for (const stmt of built.statements) await run(stmt);
  await close();

  console.log(
    `Done. ${built.classId} classes, ${built.subjectId} subjects, ${built.studentId} students, ${built.markRows} mark rows.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
