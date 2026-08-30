import { Navbar } from "@/components/Navbar";

/** Chrome for the result processing screens. The landing page at / sits
 *  outside this group and brings its own navigation. */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="gp-canvas flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
        {children}
      </main>

      {/* <footer className="no-print mx-auto w-full max-w-7xl px-4 pt-4 pb-10 sm:px-8">
        <p className="gp-label-muted">
          Marks are stored raw in Neon Postgres. Every grade point, GPA and
          checking list is recomputed from those marks by lib/grading.ts.
        </p>
      </footer> */}
    </div>
  );
}
