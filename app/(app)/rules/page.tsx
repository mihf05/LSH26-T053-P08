import { GRADE_TABLE, GPA_LETTER_TABLE } from "@/lib/grading";

export const metadata = { title: "Rules | Result Processing" };

const RULES = [
  {
    id: "R-11",
    title: "Theory and practical pass marks",
    body: "Theory is out of 75 with a pass mark of 25. Practical is out of 25 with a pass mark of 8. Failing either part fails the whole subject: grade point 0, whatever the total comes to. A subject with no practical part is out of 100 with a pass mark of 33, which is the same 33% threshold.",
  },
  {
    id: "R-12",
    title: "Absence",
    body: "Absent in a compulsory subject: the mark sheet shows AB, the subject grade point is 0 and the overall result is F. Absent in the optional subject: it contributes 0 and the student appears on the checking list.",
  },
  {
    id: "R-13",
    title: "GPA",
    body: "GPA = (sum of the six compulsory grade points + max(0, optional grade point - 2)) / 6, capped at 5.00 and shown to 2 decimal places. Any compulsory failure gives GPA 0.00 and letter F; the uncancelled average and the uncancelled GPA stay visible in the calculation trace.",
  },
  {
    id: "R-10",
    title: "Grade points and letter grades",
    body: "A subject grade point comes from its total out of 100. The final letter grade comes from the final GPA.",
  },
  {
    id: "R-29",
    title: "Office checking lists",
    body: "Optional list: every student whose optional grade point is 2.00 or below, an absent optional included. Practical fail list: every student with a practical part below 8 in any subject. Absent list: every student with AB in any subject. A student can be on more than one list.",
  },
];

export default function RulesPage() {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Marking rules</h1>
        <p className="max-w-3xl text-sm opacity-70">
          The rules the engine applies, in the order it applies them. Every line
          of a subject trace names the rule id it came from, so a result can be
          argued back to this page.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {RULES.map((r) => (
          <section
            key={r.id}
            className="card bg-base-100 border border-base-300"
          >
            <div className="card-body gap-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-sm badge-primary font-mono">
                  {r.id}
                </span>
                <h2 className="font-semibold">{r.title}</h2>
              </div>
              <p className="text-sm opacity-80">{r.body}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="alert alert-info items-start">
        <div className="flex w-full flex-col gap-1">
          <h2 className="font-semibold">Two things the brief left open</h2>
          <p className="text-sm">
            <strong>The subject grade point table.</strong> The brief gives the
            letter grade bands for the final GPA but not the table that turns a
            subject mark into a grade point. The standard band table that
            produces exactly those letters is used, below.
          </p>
          <p className="text-sm">
            <strong>Subjects with no practical part.</strong> The 75 + 25 split
            only describes subjects that carry a practical. A subject without
            one is marked out of 100 with a pass mark of 33 &mdash; the same 33%
            threshold as 25/75 and 8/25 &mdash; so one grade point table covers
            every subject.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">
              Subject total out of 100 &rarr; grade point (R-10)
            </h2>
            <table className="table table-sm table-tight">
              <thead>
                <tr>
                  <th>Total</th>
                  <th className="text-right">Grade point</th>
                  <th>Letter</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_TABLE.map((row) => (
                  <tr key={row.letter}>
                    <td className="font-mono">
                      {row.min} - {row.max}
                    </td>
                    <td className="text-right font-mono">
                      {row.point.toFixed(2)}
                    </td>
                    <td>{row.letter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">
              Final GPA &rarr; letter grade (R-10)
            </h2>
            <table className="table table-sm table-tight">
              <thead>
                <tr>
                  <th>GPA</th>
                  <th>Letter</th>
                </tr>
              </thead>
              <tbody>
                {GPA_LETTER_TABLE.map((row) => (
                  <tr key={row.letter}>
                    <td className="font-mono">
                      {row.min === row.max
                        ? row.min.toFixed(2)
                        : `${row.min.toFixed(2)} - ${row.max.toFixed(2)}`}
                    </td>
                    <td>{row.letter}</td>
                  </tr>
                ))}
                <tr>
                  <td className="font-mono">fail</td>
                  <td>F</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs opacity-60">
              A compulsory failure short circuits this table: the GPA is set to
              0.00 and the letter to F (R-13).
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
