# School Result Processing and GPA Engine

Processes a mark sheet for two classes of 32 students, applies the marking
rules, and produces for every student a grade point per subject, a final GPA,
a letter grade, a full calculation trace, and the three checking lists the
office verifies by hand before results go out.

Next.js (App Router) + daisyUI + Postgres on Neon.

## Where the four required items live

| # | Requirement | Where |
|---|---|---|
| 1 | 60+ students, two classes, six compulsory subjects and one optional, split theory/practical marks, 8+ hard edge cases | `scripts/seed.mjs`, `db/schema.sql`, `db/seed.sql` — 64 students, 10 hand written edge cases |
| 2 | Grade point per subject, final GPA, letter grade | `lib/grading.ts` — `evaluateSubject`, `evaluateStudent` |
| 3 | Per student trace: mark used, grade point, and the rule that decided it | `/students/[id]` — plus the failing subject called out for a student with a high average |
| 4 | Office checking list | `/checking-lists` — the optional, practical fail and absent lists |

## The rules

The engine is a single pure module, `lib/grading.ts`. Every decision it makes
carries the id of the rule that made it, and the same id appears in the UI, so
a printed result can be argued back to a rule.

- **R-11** Theory is out of 75 with a pass mark of 25; practical is out of 25
  with a pass mark of 8. Failing either part fails the subject: grade point 0.
- **R-12** Absent in a compulsory subject shows AB, subject grade point 0 and
  an overall result of F. Absent in the optional subject contributes 0 and puts
  the student on the checking list.
- **R-13** `GPA = (sum of the six compulsory grade points + max(0, optional - 2)) / 6`,
  capped at 5.00 and shown to 2 decimal places. Any compulsory failure gives
  GPA 0.00 and letter F, while the uncancelled average and the uncancelled GPA
  stay visible in the trace.
- **R-10** Subject grade point from the total out of 100; final letter grade
  from the final GPA. Both tables are on the `/rules` page.
- **R-29** Checking lists — optional list: optional grade point 2.00 or below
  (an absent optional counts); practical fail list: any practical part below 8;
  absent list: any AB. A student can be on more than one list.

### Two things the brief left open, and what was assumed

1. **The mark to grade point table.** The brief gives the letter grade bands
   for the final GPA but not the subject table. The standard band table that
   produces exactly those letters is used: 80+ = 5.00 A+, 70-79 = 4.00 A,
   60-69 = 3.50 A-, 50-59 = 3.00 B, 40-49 = 2.00 C, 33-39 = 1.00 D, below 33 =
   0.00 F. A practical subject's total is theory (75) + practical (25) = 100.
2. **Subjects with no practical part.** The 75/25 split only describes subjects
   that have a practical. A subject without one is marked out of 100 with a
   pass mark of 33 — the same 33% threshold as 25/75 and 8/25 — so the same
   grade point table applies to every subject.

Both assumptions are stated on the `/rules` page in the app as well.

## The data

64 students over two classes (Science and Business Studies), six compulsory
subjects and one optional fourth subject each, three of the seven subjects in
each class carrying a practical part. Marks are generated from a fixed PRNG
seed, so re-running the seed reproduces the mark sheet byte for byte.

Ten students are hand written to sit on a hard edge:

| Roll | Class | Edge |
|---|---|---|
| 1 | Science | One failed compulsory subject on a strong average (average 74.43, uncancelled GPA 4.50, final 0.00 F) |
| 2 | Science | Practical fail behind a passing theory mark (Physics 58/75 theory, 6/25 practical) |
| 3 | Science | Optional subject below the point where it helps (grade point 2.00, bonus 0.00) |
| 4 | Science | Absent in a compulsory subject |
| 5 | Science | Absent in the optional subject, everything else passing |
| 6 | Science | GPA cap: 33.00 / 6 = 5.50 capped at 5.00 |
| 1 | Business | Exactly on both pass marks (theory 25, practical 8) |
| 2 | Business | Practical one mark short (7/25) behind a 70/75 theory mark |
| 3 | Business | Optional grade point 1.00, still on the optional list |
| 4 | Business | On all three checking lists at once |

Marks are the only thing stored. Grade points, GPAs and the checking lists are
recomputed by the engine on every request, so a corrected mark can never leave
a stale result behind.

## Running it

```bash
npm install
cp .env.example .env.local     # put your Neon connection string in DATABASE_URL
npm run db:seed                # applies db/schema.sql and inserts the cohort
npm run dev
```

`DATABASE_URL` may be a Neon HTTP URL (`*.neon.tech`, the default) or a plain
Postgres URL for local development — `lib/db.ts` picks the driver from the
hostname.

If the machine running the seed cannot reach the database directly,
`npm run db:sql` prints the whole seed as SQL (also checked in at
`db/seed.sql`) to apply with any Postgres client.

## Verifying the engine

```bash
npm run verify
```

Runs the ten edge cases through the engine with the result worked out by hand:
final GPA, uncancelled GPA, letter grade, optional bonus, checking list
membership, the subject reported as the cause of a cancelled GPA, and the rule
id that decided the critical subject — plus every letter grade boundary. 92
assertions.

## Pages

- `/` — the landing page, built from the Figma design (see below)
- `/dashboard` — cohort summary, grade distribution, and the edge cases with their reasons
- `/students` — all students, filterable by class, result and checking list; a
  cancelled GPA shows the uncancelled figure beside it and names the subject
  that cancelled it
- `/students/[id]` — the full trace for one student
- `/checking-lists` — the three lists, with what to verify on each row
- `/rules` — the rules and both grade tables

## Landing page

`/` is a single page landing built from the Figma design
`QMI63rM4YzUCDpN91OtS6Z`, node `1:265` ("Desktop"). It reproduces that frame's
type scale, spacing, colours and layout; the copy is the result processing
system's rather than the template's, kept at the same line lengths so the
design's block heights hold.

Measured against the frame at 1280px: hero 960x608, feature image 693x502, case
study image 498x280, testimonial image 612x700, value card 403x246, footer band
1240x280, and a total page height of 5666px against the design's 5646px. The
remaining few pixels come from Source Serif 4 (the current Google release of the
family the design names "Source Serif Pro") having slightly different line
metrics.

Three families are loaded through `next/font/google`: Source Serif 4, Radio
Canada Big and Geist Mono. Their CSS variables are declared on `<html>` so that
the families in the `@theme` block, which Tailwind emits at `:root`, can resolve
them.

The images are **not** in the repository. Fetch them with:

```bash
npm run assets:landing
```

See `public/landing/README.md` and the manifest in `lib/landing-assets.ts` for
the file names, sizes and the Figma layer each one comes from.

## Themes

All 35 daisyUI themes are enabled across the result processing screens. The
picker in that navbar lists every one of them with a live four-colour swatch, and the choice is remembered in
`localStorage`. An inline script in `app/layout.tsx` applies the remembered
theme before the first paint, so navigating does not flash the default.

`lib/themes.ts` holds the list; it must stay in step with the `themes:` line in
`app/globals.css`, since a name in the picker that is not enabled in the CSS
falls back to the default theme. The default is `corporate`, with `business`
used when the browser asks for dark and the reader has not chosen one. The
landing page is deliberately outside this system: it paints the design's own
literal colours so a theme cannot alter it.
