import { GradeBadge } from "@/components/GradeBadge";
import { PageHeader, SectionHeader } from "@/components/PageHeader";
import { GPA_LETTER_TABLE, GRADE_TABLE } from "@/lib/grading";

export const metadata = { title: "Rules | GradePoint" };

const RULES = [
  {
    id: "R-11",
    title: "Theory and practical pass marks",
    body: "Theory is out of 75 and passes at 25. Practical is out of 25 and passes at 8. Failing either part fails the whole subject at 0.00 grade points, however high the total. A subject with no practical is out of 100 and passes at 33.",
  },
  {
    id: "R-12",
    title: "What an absence does",
    body: "An absence in a compulsory subject prints AB, scores 0.00 and cancels the result to F. An absence in the optional subject adds no bonus and puts the student on the checking list.",
  },
  {
    id: "R-13",
    title: "The GPA formula, and cancellation",
    body: "GPA is the compulsory grade points plus max(0, optional − 2), divided by 6, capped at 5.00 and rounded to two places. Any compulsory failure cancels it to 0.00 and F — the uncancelled figure stays visible in the trace so the drop can be explained.",
  },
  {
    id: "R-10",
    title: "Marks to grade points, GPA to letters",
    body: "A subject's grade point comes from its total mark out of 100. The final letter comes from the overall GPA. Both tables are below.",
  },
  {
    id: "R-29",
    title: "Who lands on a checking list",
    body: "Optional list: optional grade point of 2.00 or below, or AB. Practical fail list: practical under 8 in any subject. Absentee list: AB anywhere. A student who trips more than one appears on each.",
  },
];

export default function RulesPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader eyebrow="5 rules · enforced in lib/grading.ts" title="The rules the engine runs on">
        Every grade point on this site cites one of these, so a result can
        always be argued back to the rule that produced it.
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {RULES.map((r) => (
          <section key={r.id} className="gp-card flex flex-col gap-4 p-5">
            <span className="gp-pill-quiet self-start">{r.id}</span>
            <h2 className="gp-h2">{r.title}</h2>
            <p className="gp-body">{r.body}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex flex-col gap-4">
          <SectionHeader title="Subject mark to grade point" meta="R-10">
            The mark out of 100 for one subject.
          </SectionHeader>
          <div className="gp-card overflow-x-auto p-5 sm:p-6">
            <table className="gp-table table-tight w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-0 py-2">Marks</th>
                  <th className="px-3 py-2 text-right">Grade point</th>
                  <th className="px-3 py-2 text-right">Letter</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_TABLE.map((row) => (
                  <tr key={row.letter}>
                    <td className="gp-num px-0 py-3">
                      {row.min}–{row.max}
                    </td>
                    <td className="gp-num px-3 py-3 text-right">
                      {row.point.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <GradeBadge letter={row.letter} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader title="GPA to final letter" meta="R-10">
            The overall result, once every subject is in.
          </SectionHeader>
          <div className="gp-card overflow-x-auto p-5 sm:p-6">
            <table className="gp-table table-tight w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-0 py-2">GPA</th>
                  <th className="px-3 py-2 text-right">Letter</th>
                </tr>
              </thead>
              <tbody>
                {GPA_LETTER_TABLE.map((row) => (
                  <tr key={row.letter}>
                    <td className="gp-num px-0 py-3">
                      {row.min === row.max
                        ? row.min.toFixed(2)
                        : `${row.min.toFixed(2)}–${row.max.toFixed(2)}`}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <GradeBadge letter={row.letter} size="sm" />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-0 py-3">
                    <span className="gp-label">Any compulsory fail</span>
                    <span className="gp-label-muted block">
                      Overrides the table above (R-13)
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <GradeBadge letter="F" size="sm" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="gp-card flex flex-col gap-5 p-5 sm:p-6">
        <span className="gp-label">Two things the spec leaves open</span>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h3 className="gp-h2">Subject grade points</h3>
            <p className="gp-body">
              A subject&apos;s grade point uses the same mark bands as the final
              letter grades, so one scale covers both.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="gp-h2">Subjects without a practical</h3>
            <p className="gp-body">
              Marked out of 100 and passed at 33, which keeps the pass mark at
              33% for every subject either way.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
