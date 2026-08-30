import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/checking-lists", label: "Checking lists" },
  { href: "/rules", label: "Rules" },
];

/** Chrome for the result processing screens. The landing page at / sits
 *  outside this group and brings its own navigation. */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 border-b border-base-300 no-print">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2 px-4">
          <Link href="/" className="flex items-center gap-2 py-1">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-content font-bold">
              G
            </span>
            <span className="text-sm leading-tight font-semibold">
              Result Processing
              <span className="block text-[0.7rem] font-normal opacity-60">
                and GPA engine
              </span>
            </span>
          </Link>
          <nav className="ml-auto flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="btn btn-ghost btn-sm"
              >
                {item.label}
              </Link>
            ))}
            <ThemeSwitcher />
          </nav>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>

      <footer className="mx-auto w-full max-w-7xl px-4 pb-10 pt-2 text-xs opacity-60 no-print">
        Marks are stored raw in Neon Postgres. Every grade point, GPA and
        checking list on this site is recomputed from those marks by the engine
        in <code className="font-mono">lib/grading.ts</code>.
      </footer>
    </div>
  );
}
