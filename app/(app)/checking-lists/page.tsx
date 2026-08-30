import { ListSection } from "@/components/ListSection";
import { getCheckingLists } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checking lists | Result Processing" };

export default async function CheckingListsPage() {
  const lists = await getCheckingLists();

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-lg border border-base-300 bg-base-100 p-8 sm:p-10 shadow-xs top-gradient-border">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Audit & Compliance
            </span>
            <span className="text-xs text-base-content/60 font-medium">
              Rule R-29 Verification
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            Administrative Checking Lists
          </h1>
          <p className="max-w-3xl text-sm opacity-75 leading-relaxed">
            Manual verification queues for student records affected by optional subject thresholds, practical failure penalties, or absentee markers. Teachers should verify these{" "}
            <span className="font-bold text-base-content">{lists.any.length} students</span> before printing formal grade reports.
          </p>

          <div className="mt-3 flex flex-wrap gap-3 no-print">
            <a
              href="#optional"
              className="btn btn-sm rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 transition-colors duration-200"
            >
              Optional Rule List ({lists.optional.length})
            </a>
            <a
              href="#practical"
              className="btn btn-sm rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 hover:bg-rose-500/20 transition-colors duration-200"
            >
              Practical Fail List ({lists.practicalFail.length})
            </a>
            <a
              href="#absent"
              className="btn btn-sm rounded-md bg-slate-500/10 border border-slate-500/30 text-slate-900 dark:text-slate-200 hover:bg-slate-500/20 transition-colors duration-200"
            >
              Absentee List ({lists.absent.length})
            </a>
          </div>
        </div>
      </div>

      <ListSection
        id="optional"
        title="1. Optional Subject Threshold List"
        rule="R-29"
        toneClass="border-amber-500/30"
        badgeBg="bg-amber-500/15 text-amber-700 dark:text-amber-300"
        description="Students whose optional grade point is 2.00 or below. The formula max(0, optional - 2) contributed 0 bonus points toward their overall GPA. Absent optional subjects are also indexed here."
        rows={lists.optional}
        type="optional"
      />

      <ListSection
        id="practical"
        title="2. Practical Component Failure List"
        rule="R-29"
        toneClass="border-rose-500/30"
        badgeBg="bg-rose-500/15 text-rose-700 dark:text-rose-300"
        description="Students scoring below the practical pass threshold (<8) in any subject. The subject receives 0 grade points despite passing theory marks. Recommended for re-checking practical mark registers."
        rows={lists.practicalFail}
        type="practical"
      />

      <ListSection
        id="absent"
        title="3. Absentee Verification List"
        rule="R-29"
        toneClass="border-slate-500/30"
        badgeBg="bg-slate-500/15 text-slate-700 dark:text-slate-300"
        description="Students marked AB (Absent) in one or more subjects. An absence in a compulsory subject cancels the entire result to F, while an absence in an optional subject contributes 0 bonus."
        rows={lists.absent}
        type="absent"
      />
    </div>
  );
}
