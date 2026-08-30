import { Navbar } from "@/components/Navbar";

/** Chrome for the result processing screens. The landing page at / sits
 *  outside this group and brings its own navigation. */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-grid-pattern flex min-h-screen flex-col bg-base-200/50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
        {children}
      </main>

      <footer className="no-print mx-auto w-full max-w-7xl px-4 pt-2 pb-10 text-xs opacity-60 sm:px-8">
        Marks are stored raw in Neon Postgres. Every grade point, GPA and
        checking list on this site is recomputed from those marks by the engine
        in <code className="font-mono">lib/grading.ts</code>.
      </footer>
    </div>
  );
}
