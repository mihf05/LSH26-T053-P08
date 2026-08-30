import Link from "next/link";
import { ButtonPrimary, ButtonSecondary } from "@/components/landing/Buttons";
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

const JOURNAL = [
  {
    image: "journal-1.png",
    title: "Failing either part fails the whole subject",
    tag: "R-11",
    read: "2 min",
  },
  {
    image: "journal-2.png",
    title: "What an absence does to the optional subject",
    tag: "R-12",
    read: "3 min",
  },
  {
    image: "journal-3.png",
    title: "Why a 74.43 average can still come out as F",
    tag: "R-13",
    read: "4 min",
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
              <ButtonPrimary href="/dashboard" label="Open the dashboard" />
              <ButtonPrimary href="/students" label="Explore the engine" />
            </div>
          </div>
          <div className="relative aspect-[960/608] w-full max-w-[960px] rounded-[24px] border-2 border-solid border-black">
            <img
              src={asset("hero.png")}
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
                src={asset("feature.png")}
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
                href="/students/1"
                label="Open a student trace"
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
      {/* Case study section (1:314)                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="flex w-full flex-col items-center px-[20px] py-[40px] sm:py-[80px] lg:py-[120px]">
        <div className="flex w-full max-w-[980px] flex-col items-center gap-[40px] rounded-[16px] bg-[#f6f8fb] p-[20px] md:flex-row">
          <div className="relative aspect-[498/280] w-full rounded-[8px] md:aspect-auto md:h-[280px] md:flex-1 lg:w-[498px] lg:flex-none">
            <img
              src={asset("case-study.png")}
              alt="Teachers going through a class mark sheet together"
              className="absolute inset-0 size-full rounded-[8px] object-cover"
            />
          </div>
          <div className="flex w-full flex-col items-start gap-[32px] md:flex-1 lg:w-[403px] lg:flex-none">
            <div className="flex w-full flex-col items-start gap-[16px] text-[18px] text-black sm:text-[20px]">
              <h2 className="font-display w-full leading-none font-medium tracking-[-0.02em]">
                Why the office checks 31 students by hand
              </h2>
              <p className="font-serif-display w-full leading-[1.2] tracking-[-0.04em]">
                Across 64 students in two classes, a rule changed the printed
                result for 31 of them. The engine names each one, the rule that
                did it, and exactly what a teacher should verify before results
                go out.
              </p>
            </div>
            <ButtonSecondary
              href="/checking-lists"
              label="Open the checking lists"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Journal section (1:322)                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="flex w-full flex-col items-center gap-[40px] px-[20px]">
        <h2 className="font-display w-full max-w-[612px] text-center text-[24px] leading-none font-medium tracking-[-0.03em] text-black sm:text-[32px] lg:text-[40px]">
          From the rulebook
        </h2>
        <div className="relative flex w-full max-w-[620px] flex-col items-center gap-[24px]">
          {/* Sticker (1:330): rotated, hanging off the left of the list. */}
          <div
            className="pointer-events-none absolute top-[-109px] left-[-287px] hidden h-[221.12px] w-[420.665px] items-center justify-center xl:flex"
            aria-hidden
          >
            <span className="block -rotate-10">
              <img
                src={asset("sticker.svg")}
                alt=""
                width={400}
                height={154}
                className="block h-[154px] w-[400px]"
              />
            </span>
          </div>

          <div className="flex w-full flex-col items-start">
            {JOURNAL.map((item, i) => (
              <article
                key={item.title}
                className={`flex w-full items-start border-b border-solid border-[#dbe0ec] ${
                  i === 0 ? "border-t" : ""
                }`}
              >
                <div className="flex w-full flex-col items-start justify-between gap-[16px] py-[24px] sm:flex-row sm:gap-0">
                  <div className="relative h-[100px] w-[165px] shrink-0">
                    <img
                      src={asset(item.image)}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  </div>
                  <div className="flex w-full flex-col items-start gap-[8px] leading-none sm:w-[439px]">
                    <h3 className="font-display w-full text-[18px] font-medium tracking-[-0.02em] text-black sm:text-[20px]">
                      {item.title}
                    </h3>
                    <div className="flex items-start gap-[8px] font-mono text-[14px] whitespace-nowrap text-[#6c6c6c]">
                      <span>{item.tag}</span>
                      <span>·</span>
                      <span>{item.read}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <ButtonSecondary
            href="/rules"
            label="View all rules"
            className="w-full sm:w-auto"
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Testimonial section (1:369)                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="flex w-full items-start justify-center px-[20px] py-[40px] sm:py-[80px] lg:py-[120px]">
        <div className="flex w-full max-w-[1500px] min-w-px flex-1 flex-col items-center gap-[16px] md:flex-row">
          <div className="relative aspect-[612/700] w-full shrink-0 md:w-[calc(50%-8px)]">
            <img
              src={asset("testimonial.png")}
              alt="A student reading their result sheet"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex w-full min-w-px flex-1 flex-col items-start justify-center gap-[32px] sm:gap-[56px] md:px-[40px] lg:px-[105px]">
            <img
              src={asset("quotation.svg")}
              alt=""
              width={24}
              height={20}
              className="block h-[20px] w-[24px] shrink-0"
              aria-hidden
            />
            <blockquote className="font-display w-full text-[24px] leading-none font-medium tracking-[-0.03em] text-black sm:text-[32px] lg:text-[40px]">
              Any compulsory failure gives GPA 0.00 and letter F; the
              uncancelled average stays visible in the calculation trace.
            </blockquote>
            <div className="flex w-full flex-col items-start gap-[8px] text-[18px] sm:text-[20px]">
              <p className="font-display w-full leading-none font-medium tracking-[-0.02em] text-black">
                Rule R-13
              </p>
              <p className="font-serif-display w-full leading-[1.2] tracking-[-0.04em] text-[#6c6c6c]">
                Marking rules, Class 10 result processing
              </p>
            </div>
          </div>
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
            <Link href="/students">Students</Link>
            <Link href="/checking-lists">Checking lists</Link>
            <Link href="/rules">Rules</Link>
            <Link href="/dashboard">Get started</Link>
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
