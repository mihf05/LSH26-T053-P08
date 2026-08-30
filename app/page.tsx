import Link from "next/link";
import { ButtonPrimary } from "@/components/landing/Buttons";
import { LandingNav } from "@/components/landing/LandingNav";
import { asset } from "@/lib/landing-assets";

export const metadata = {
  title: "GradePoint — School Result Processing and GPA Engine",
  description:
    "Grade points, GPAs, per student calculation traces and the office checking lists, computed from raw marks and traceable to a rule.",
};

/* Content mirrors the Figma layout line for line, at the same lengths, so the
   design's line counts and block heights hold. */

const FEATURES = [
  {
    n: "001",
    title: "Compute",
    body: "Theory and practical marks against their own pass marks",
  },
  {
    n: "002",
    title: "Trace",
    body: "Every grade point beside the rule that decided it",
  },
  {
    n: "003",
    title: "Check",
    body: "Optional, practical fail and absent lists for the office",
  },
  {
    n: "004",
    title: "Verify",
    body: "Ninety-two assertions pinning every hard edge case",
  },
];

const VALUES = [
  {
    icon: "icon-1.svg",
    title: "Marks are the only source",
    body: "Grade points, GPAs and the lists are recomputed on every request, so a corrected mark never goes stale.",
  },
  {
    icon: "icon-2.svg",
    title: "Every result cites its rule",
    body: "Every rule id appears in the trace beside the mark that produced it, so a grade can be argued back.",
  },
  {
    icon: "icon-3.svg",
    title: "The hard edges come first",
    body: "Practical fails, absences and a weak optional subject are the cases the engine is built to get right.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex w-full flex-col items-center bg-white">
      {/* ---------------------------------------------------------------- */}
      {/* Intro + Features section (1:266)                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative flex w-full flex-col items-start">
        {/* Gradient background (1:267): the top 41.75% of this section. */}
        <div
          className="absolute inset-x-0 top-0 bottom-[58.25%] bg-gradient-to-b from-[#a8d3ff] to-[#fff4df]"
          aria-hidden
        />
        <LandingNav />

        <header className="relative flex w-full flex-col items-center gap-[32px] px-[20px] pt-[120px] sm:gap-[56px] sm:pt-[140px]">
          <div className="flex w-full max-w-[1030px] flex-col items-center gap-[32px]">
            <div className="flex w-full flex-col items-center gap-[16px] text-center text-black">
              <h1 className="flex w-full flex-col items-center text-[36px] leading-none sm:text-[64px] lg:text-[80px]">
                <span className="font-serif-display mb-[-8px] block w-full tracking-[-0.04em]">
                  Result processing,
                </span>
                <span className="font-display block w-full font-normal tracking-[-0.05em]">
                  built on the rules
                </span>
              </h1>
              <p className="font-serif-display w-full text-[18px] leading-[1.2] tracking-[-0.04em] sm:text-[20px]">
                Grade points, GPAs and the checking lists—computed from raw
                marks, every one traceable to a rule.
              </p>
            </div>
            <div className="flex flex-col items-center gap-[16px] sm:flex-row">
              <ButtonPrimary href="/dashboard" label="Open dashboard" />
              <ButtonPrimary href="/rules" label="View rules" />
            </div>
          </div>
          <div className="relative aspect-[960/608] w-full max-w-[960px] rounded-[24px] border-2 border-solid border-black">
            <img
              src={asset("hero.jpg")}
              alt="The result dashboard showing the grade distribution, pass rate and the students on the checking lists"
              className="absolute inset-0 size-full rounded-[24px] object-cover"
            />
          </div>
        </header>

        <main className="relative flex w-full flex-col items-center gap-[40px] px-[20px] py-[40px] sm:py-[80px] lg:py-[120px]">
          <h2 className="font-display w-full max-w-[612px] text-center text-[24px] leading-none font-medium tracking-[-0.03em] text-black sm:text-[32px] lg:text-[40px]">
            Everything the office needs to compute, trace, and check a result
          </h2>
          <div className="flex w-full max-w-[1500px] flex-col items-center gap-[40px] lg:flex-row">
            <div className="relative aspect-[693/502] w-full shrink-0 lg:w-[693px]">
              <img
                src={asset("feature.svg")}
                alt="A subject trace showing the mark used, the grade point and the rule that decided it"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="flex w-full min-w-px flex-1 flex-col items-start gap-[24px]">
              <ul className="flex w-full flex-col items-start">
                {FEATURES.map((item, i) => (
                  <li
                    key={item.n}
                    className={`flex w-full flex-col items-start gap-[16px] border-t border-solid border-[#dbe0ec] py-[24px] ${
                      i === FEATURES.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex w-full items-start gap-[16px] leading-none">
                      <h3 className="font-display min-w-px flex-1 text-[18px] font-medium tracking-[-0.02em] text-black sm:text-[20px]">
                        {item.title}
                      </h3>
                      <span className="font-mono text-[14px] whitespace-nowrap text-[#6c6c6c]">
                        {item.n}
                      </span>
                    </div>
                    <p className="font-serif-display w-full text-[18px] leading-[1.2] tracking-[-0.04em] text-black sm:text-[20px]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
              <ButtonPrimary
                href="/dashboard"
                label="Open the dashboard"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </main>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Values section (1:306)                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative flex w-full flex-col items-center gap-[40px] px-[20px] py-[40px] sm:py-[80px] lg:py-[120px]">
        <img
          src={asset("values-bg.png")}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        <div className="relative flex w-full max-w-[1500px] flex-col items-center text-center text-[36px] leading-none text-black sm:text-[64px] lg:text-[80px]">
          <h2 className="font-serif-display mb-[-8px] block w-full tracking-[-0.04em]">
            Built for accuracy
          </h2>
          <p className="font-display block w-full font-normal tracking-[-0.05em]">
            Designed for audit
          </p>
        </div>
        <div className="relative flex w-full max-w-[1500px] flex-col items-stretch gap-[16px] lg:flex-row lg:items-start">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="flex min-h-[246px] min-w-px flex-1 flex-col items-start gap-[24px] rounded-[16px] bg-white p-[40px]"
            >
              <img
                src={asset(value.icon)}
                alt=""
                width={42}
                height={42}
                className="block size-[42px] shrink-0"
              />
              <div className="flex w-full flex-col items-start gap-[8px] text-[18px] text-black sm:text-[20px]">
                <h3 className="font-display w-full leading-none font-medium tracking-[-0.02em]">
                  {value.title}
                </h3>
                <p className="font-serif-display w-full leading-[1.2] tracking-[-0.04em]">
                  {value.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>



          {/* ---------------------------------------------------------------- */}
      {/* Call to action (1:378)                                            */}
      {/* ---------------------------------------------------------------- */}
      <aside className="flex w-full flex-col items-center gap-[32px] bg-[#f6f8fb] px-[20px] py-[40px] sm:py-[80px] lg:py-[120px]">
        <h2 className="font-display w-full max-w-[1500px] text-center text-[24px] leading-none font-medium tracking-[-0.03em] text-black sm:text-[32px] lg:text-[40px]">
          Ready to run the results for your class?
        </h2>
        <ButtonPrimary href="/dashboard" label="Open the dashboard" />
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Footer (1:379)                                                    */}
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
