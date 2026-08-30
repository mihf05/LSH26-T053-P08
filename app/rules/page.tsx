import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { ButtonPrimary } from "@/components/landing/Buttons";
import { GradeBadge } from "@/components/GradeBadge";
import { GPA_LETTER_TABLE, GRADE_TABLE } from "@/lib/grading";
import { asset } from "@/lib/landing-assets";

export const metadata = {
  title: "Rules & Grading Specs — GradePoint",
  description:
    "Every rule and mark evaluation standard enforced by the GradePoint engine.",
};

const RULES = [
  {
    id: "R-11",
    n: "01",
    title: "Theory & practical pass marks",
    body: "Theory is out of 75 with a pass mark of 25. Practical is out of 25 with a pass mark of 8. Failing either component fails the whole subject at 0.00 grade points regardless of total score. Non-practical subjects are marked out of 100 with a 33 pass mark.",
  },
  {
    id: "R-12",
    n: "02",
    title: "Absence handling",
    body: "Absence (AB) in any compulsory subject scores 0.00 grade points and cancels the overall result to F. An absence in the optional subject adds 0 bonus points and flags the student for office review.",
  },
  {
    id: "R-13",
    n: "03",
    title: "GPA formula & cancellation",
    body: "GPA = (sum of compulsory grade points + max(0, optional − 2)) / 6, capped at 5.00 and rounded to 2 decimal places. Any compulsory failure cancels the final GPA to 0.00 (F), while preserving the uncancelled trace for auditability.",
  },
  {
    id: "R-10",
    n: "04",
    title: "Mark scale & letter grades",
    body: "Subject grade points map directly from total marks out of 100. Final letter grades map from the overall computed GPA. Both official lookup tables are detailed below.",
  },
  {
    id: "R-29",
    n: "05",
    title: "Checking list criteria",
    body: "Students land on office checking lists if: Optional subject ≤ 2.00 GP (or AB), Practical part < 8 marks, or Absent (AB) in any subject. Triggers can overlap.",
  },
];

export default function RulesPage() {
  return (
    <div className="flex w-full flex-col items-center bg-white min-h-screen">
      {/* ---------------------------------------------------------------- */}
      {/* Hero section with landing gradient                                */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative flex w-full flex-col items-start">
        <div
          className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[#a8d3ff] to-[#fff4df]"
          aria-hidden
        />
        <LandingNav />

        <header className="relative flex w-full flex-col items-center gap-[32px] px-[20px] pt-[120px] pb-[60px] sm:pt-[140px] sm:pb-[80px]">
          <div className="flex w-full max-w-[1030px] flex-col items-center gap-[24px] text-center text-black">
            <h1 className="flex w-full flex-col items-center text-[36px] leading-none sm:text-[64px] lg:text-[76px]">
              <span className="font-serif-display mb-[-8px] block w-full tracking-[-0.04em]">
                The rules engine,
              </span>
              <span className="font-display block w-full font-normal tracking-[-0.05em]">
                documented & audited
              </span>
            </h1>
            <p className="font-serif-display w-full max-w-[720px] text-[18px] leading-[1.3] tracking-[-0.04em] sm:text-[20px]">
              Every grade point, letter grade, and checking flag computed by GradePoint is strictly grounded in these 5 core rules.
            </p>
            <div className="mt-4 flex flex-col items-center gap-[16px] sm:flex-row">
              <ButtonPrimary href="/dashboard" label="Open the dashboard" />
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Core Rules Section                                                */}
        {/* ---------------------------------------------------------------- */}
        <main className="relative flex w-full flex-col items-center gap-[60px] px-[20px] py-[40px] sm:py-[80px]">
          <div className="flex w-full max-w-[1240px] flex-col items-center gap-[40px]">
            <h2 className="font-display w-full max-w-[700px] text-center text-[24px] leading-none font-medium tracking-[-0.03em] text-black sm:text-[36px] lg:text-[44px]">
              Core evaluation rules
            </h2>

            <div className="grid w-full grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-12">
              {/* Rule 1: R-11 (Featured Large - 7 cols) */}
              <div className="flex flex-col justify-between gap-[24px] rounded-[24px] border border-solid border-[#dbe0ec] bg-gradient-to-br from-[#ffffff] to-[#f4f7fc] p-[36px] shadow-sm transition-all hover:border-[#a8d3ff] hover:shadow-md lg:col-span-7">
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[13px] font-bold tracking-wider uppercase text-black bg-[#fff546] px-3.5 py-1 rounded-full shadow-xs">
                    {RULES[0].id}
                  </span>
                  <span className="font-mono text-[14px] font-medium text-[#888888]">
                    {RULES[0].n}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-[12px] pt-4">
                  <h3 className="font-display text-[26px] leading-tight font-medium tracking-[-0.03em] text-black sm:text-[28px]">
                    {RULES[0].title}
                  </h3>
                  <p className="font-serif-display text-[18px] leading-[1.45] tracking-[-0.03em] text-[#333333]">
                    {RULES[0].body}
                  </p>
                </div>
              </div>

              {/* Rule 3: R-13 (Featured Large - 5 cols) */}
              <div className="flex flex-col justify-between gap-[24px] rounded-[24px] border border-solid border-[#dbe0ec] bg-gradient-to-br from-[#ffffff] to-[#fbf8ee] p-[36px] shadow-sm transition-all hover:border-[#ffe885] hover:shadow-md lg:col-span-5">
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[13px] font-bold tracking-wider uppercase text-black bg-[#fff546] px-3.5 py-1 rounded-full shadow-xs">
                    {RULES[2].id}
                  </span>
                  <span className="font-mono text-[14px] font-medium text-[#888888]">
                    {RULES[2].n}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-[12px] pt-4">
                  <h3 className="font-display text-[26px] leading-tight font-medium tracking-[-0.03em] text-black sm:text-[28px]">
                    {RULES[2].title}
                  </h3>
                  <p className="font-serif-display text-[17px] leading-[1.45] tracking-[-0.03em] text-[#333333]">
                    {RULES[2].body}
                  </p>
                </div>
              </div>

              {/* Rule 2: R-12 (4 cols) */}
              <div className="flex flex-col justify-between gap-[20px] rounded-[24px] border border-solid border-[#dbe0ec] bg-[#f8fafc] p-[32px] transition-all hover:border-[#cbd5e1] hover:bg-white lg:col-span-4">
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[13px] font-bold tracking-wider uppercase text-black bg-[#fff546] px-3.5 py-1 rounded-full shadow-xs">
                    {RULES[1].id}
                  </span>
                  <span className="font-mono text-[14px] font-medium text-[#888888]">
                    {RULES[1].n}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-[10px]">
                  <h3 className="font-display text-[22px] leading-tight font-medium tracking-[-0.02em] text-black">
                    {RULES[1].title}
                  </h3>
                  <p className="font-serif-display text-[16px] leading-[1.4] tracking-[-0.03em] text-[#444444]">
                    {RULES[1].body}
                  </p>
                </div>
              </div>

              {/* Rule 4: R-10 (4 cols) */}
              <div className="flex flex-col justify-between gap-[20px] rounded-[24px] border border-solid border-[#dbe0ec] bg-[#f8fafc] p-[32px] transition-all hover:border-[#cbd5e1] hover:bg-white lg:col-span-4">
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[13px] font-bold tracking-wider uppercase text-black bg-[#fff546] px-3.5 py-1 rounded-full shadow-xs">
                    {RULES[3].id}
                  </span>
                  <span className="font-mono text-[14px] font-medium text-[#888888]">
                    {RULES[3].n}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-[10px]">
                  <h3 className="font-display text-[22px] leading-tight font-medium tracking-[-0.02em] text-black">
                    {RULES[3].title}
                  </h3>
                  <p className="font-serif-display text-[16px] leading-[1.4] tracking-[-0.03em] text-[#444444]">
                    {RULES[3].body}
                  </p>
                </div>
              </div>

              {/* Rule 5: R-29 (4 cols) */}
              <div className="flex flex-col justify-between gap-[20px] rounded-[24px] border border-solid border-[#dbe0ec] bg-[#f8fafc] p-[32px] transition-all hover:border-[#cbd5e1] hover:bg-white lg:col-span-4">
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[13px] font-bold tracking-wider uppercase text-black bg-[#fff546] px-3.5 py-1 rounded-full shadow-xs">
                    {RULES[4].id}
                  </span>
                  <span className="font-mono text-[14px] font-medium text-[#888888]">
                    {RULES[4].n}
                  </span>
                </div>
                <div className="flex flex-col items-start gap-[10px]">
                  <h3 className="font-display text-[22px] leading-tight font-medium tracking-[-0.02em] text-black">
                    {RULES[4].title}
                  </h3>
                  <p className="font-serif-display text-[16px] leading-[1.4] tracking-[-0.03em] text-[#444444]">
                    {RULES[4].body}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Grade Conversion Tables                                          */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex w-full max-w-[1240px] flex-col items-center gap-[40px] pt-[40px]">
            <div className="flex flex-col items-center text-center gap-[12px]">
              <h2 className="font-display text-[24px] leading-none font-medium tracking-[-0.03em] text-black sm:text-[36px] lg:text-[44px]">
                Grade Scale & Lookup Tables
              </h2>
              <p className="font-serif-display text-[18px] text-[#6c6c6c] tracking-[-0.03em]">
                Rule R-10: Standardized grade point mapping tables
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-[32px] lg:grid-cols-2">
              {/* Subject Table */}
              <div className="flex flex-col gap-[20px] rounded-[16px] border border-solid border-[#dbe0ec] bg-white p-[32px]">
                <div className="flex items-center justify-between border-b border-solid border-[#dbe0ec] pb-[16px]">
                  <h3 className="font-display text-[20px] font-medium text-black">
                    Subject Mark to Grade Point
                  </h3>
                  <span className="font-mono text-[12px] text-[#6c6c6c]">Out of 100</span>
                </div>
                <table className="w-full text-left font-display">
                  <thead>
                    <tr className="border-b border-solid border-[#dbe0ec] font-mono text-[12px] text-[#6c6c6c]">
                      <th className="py-2 font-normal">Marks</th>
                      <th className="py-2 text-right font-normal">Grade Point</th>
                      <th className="py-2 text-right font-normal">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GRADE_TABLE.map((row) => (
                      <tr key={row.letter} className="border-b border-solid border-[#f0f3f8] text-[15px]">
                        <td className="py-3 font-mono text-black">
                          {row.min} – {row.max}
                        </td>
                        <td className="py-3 text-right font-mono font-medium text-black">
                          {row.point.toFixed(2)}
                        </td>
                        <td className="py-3 text-right">
                          <GradeBadge letter={row.letter} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* GPA Table */}
              <div className="flex flex-col gap-[20px] rounded-[16px] border border-solid border-[#dbe0ec] bg-white p-[32px]">
                <div className="flex items-center justify-between border-b border-solid border-[#dbe0ec] pb-[16px]">
                  <h3 className="font-display text-[20px] font-medium text-black">
                    GPA to Final Letter Grade
                  </h3>
                  <span className="font-mono text-[12px] text-[#6c6c6c]">Overall Result</span>
                </div>
                <table className="w-full text-left font-display">
                  <thead>
                    <tr className="border-b border-solid border-[#dbe0ec] font-mono text-[12px] text-[#6c6c6c]">
                      <th className="py-2 font-normal">GPA Range</th>
                      <th className="py-2 text-right font-normal">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GPA_LETTER_TABLE.map((row) => (
                      <tr key={row.letter} className="border-b border-solid border-[#f0f3f8] text-[15px]">
                        <td className="py-3 font-mono text-black">
                          {row.min === row.max
                            ? row.min.toFixed(2)
                            : `${row.min.toFixed(2)} – ${row.max.toFixed(2)}`}
                        </td>
                        <td className="py-3 text-right">
                          <GradeBadge letter={row.letter} size="sm" />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#fff9e6] font-display text-[14px]">
                      <td className="py-3 px-2">
                        <span className="font-medium text-black">Compulsory Fail</span>
                        <span className="block font-serif-display text-[13px] text-[#6c6c6c]">
                          Overrides table calculation (Rule R-13)
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <GradeBadge letter="F" size="sm" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Specifications section                                            */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex w-full max-w-[1240px] flex-col gap-[24px] rounded-[16px] bg-[#f6f8fb] p-[40px] border border-solid border-[#dbe0ec]">
            <h3 className="font-display text-[22px] font-medium text-black">
              System Design Assumptions & Edge Handling
            </h3>
            <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
              <div className="flex flex-col gap-[8px]">
                <h4 className="font-display text-[18px] font-medium text-black">
                  1. Subject Grade Scale
                </h4>
                <p className="font-serif-display text-[16px] leading-[1.4] text-[#444444]">
                  The subject-level grade point uses the exact same mark bands as the overall GPA letter grades, establishing a unified and predictable 5.00 grading scale across every subject.
                </p>
              </div>
              <div className="flex flex-col gap-[8px]">
                <h4 className="font-display text-[18px] font-medium text-black">
                  2. Non-Practical Subjects
                </h4>
                <p className="font-serif-display text-[16px] leading-[1.4] text-[#444444]">
                  Subjects without practical parts are evaluated out of 100 with a pass mark threshold of 33, preserving an exact 33% pass criterion across all subject types.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Call to action                                                    */}
      {/* ---------------------------------------------------------------- */}
      <aside className="flex w-full flex-col items-center gap-[32px] bg-[#f6f8fb] px-[20px] py-[40px] sm:py-[80px]">
        <h2 className="font-display w-full max-w-[1200px] text-center text-[24px] leading-none font-medium tracking-[-0.03em] text-black sm:text-[32px] lg:text-[40px]">
          Ready to verify marks against these rules?
        </h2>
        <ButtonPrimary href="/dashboard" label="Open the dashboard" />
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Footer                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="flex w-full flex-col items-center gap-[20px] bg-[#fff546] p-[20px]">
        <div className="flex w-full flex-col items-start justify-between gap-[16px] text-[18px] text-[#66640f] sm:flex-row sm:items-center sm:text-[20px]">
          <div className="font-display flex flex-wrap items-center gap-[20px] leading-none font-medium tracking-[-0.02em]">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/rules">Rules</Link>
          </div>
          <p className="font-serif-display leading-[1.2] tracking-[-0.04em] whitespace-pre sm:text-right">
            {`© 2026  ·  All rights reserved`}
          </p>
        </div>
        <div className="relative h-[140px] w-full opacity-90 mix-blend-multiply sm:h-[280px]">
          <img
            src={asset("footer-texture.png")}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="flex aspect-[1240/204] w-full items-center justify-center">
          <span className="font-display block text-[16vw] leading-none font-medium tracking-[-0.05em] text-black">
            GradePoint
          </span>
        </div>
      </footer>
    </div>
  );
}
