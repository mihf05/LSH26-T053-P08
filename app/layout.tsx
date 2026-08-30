import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Result Processing and GPA Engine",
  description:
    "Grade points, GPA, per student calculation traces and the office checking lists for two classes.",
};

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/checking-lists", label: "Checking lists" },
  { href: "/rules", label: "Rules" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-base-200 antialiased`}
      >
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
            </nav>
          </div>
        </div>

        <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>

        <footer className="mx-auto w-full max-w-7xl px-4 pb-10 pt-2 text-xs opacity-60 no-print">
          Marks are stored raw in Neon Postgres. Every grade point, GPA and
          checking list on this site is recomputed from those marks by the
          engine in <code className="font-mono">lib/grading.ts</code>.
        </footer>
      </body>
    </html>
  );
}
