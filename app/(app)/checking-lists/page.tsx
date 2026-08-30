import { ListSection } from "@/components/ListSection";
import { PageHeader } from "@/components/PageHeader";
import { getCheckingLists } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checking lists | GradePoint" };

export default async function CheckingListsPage() {
  const lists = await getCheckingLists();

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        eyebrow="R-29 · three lists"
        title="What the office checks by hand"
        actions={
          <>
            <a href="#optional" className="gp-btn">
              Optional {lists.optional.length}
            </a>
            <a href="#practical" className="gp-btn">
              Practical {lists.practicalFail.length}
            </a>
            <a href="#absent" className="gp-btn">
              Absent {lists.absent.length}
            </a>
          </>
        }
      >
        {lists.any.length} students tripped a rule that changed their printed
        result. Each one below says what to verify.
      </PageHeader>

      <ListSection
        id="optional"
        title="The optional subject did not help"
        rule="R-29"
        description="Their optional grade point is 2.00 or below, so max(0, optional − 2) added nothing to the GPA. An absent optional subject lands here too."
        rows={lists.optional}
        type="optional"
      />

      <ListSection
        id="practical"
        title="A practical came in under the pass mark"
        rule="R-29"
        description="The practical scored under 8 in at least one subject, so that subject is 0.00 grade points however well the theory went. Worth re-checking the practical register."
        rows={lists.practicalFail}
        type="practical"
      />

      <ListSection
        id="absent"
        title="Marked absent in at least one subject"
        rule="R-29"
        description="An absence in a compulsory subject cancels the whole result to F. In the optional subject it only costs the bonus."
        rows={lists.absent}
        type="absent"
      />
    </div>
  );
}
