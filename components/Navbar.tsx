"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/checking-lists", label: "Checking lists" },
];

/** The result screens' nav. Deliberately the same wordmark and link treatment
 *  as the landing page's LandingNav, so crossing from / into the app does not
 *  feel like arriving at a different product. */
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b" style={{ borderColor: "var(--gp-rule)", background: "var(--gp-canvas)" }}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link href="/" className="gp-h2 hover:opacity-70">
          GradePoint
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-[15px] leading-none font-medium whitespace-nowrap hover:opacity-60"
              style={{ color: "var(--gp-ink)" }}
            >
              {item.label}
            </Link>
          ))}
          <ThemeSwitcher />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="flex size-5 flex-col justify-center gap-[4px]"
          >
            <span className="gp-bar block h-[2px] w-full" />
            <span className="gp-bar block h-[2px] w-full" />
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t px-4 py-4 md:hidden" style={{ borderColor: "var(--gp-rule)" }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-[15px] leading-none font-medium"
              style={{ color: "var(--gp-ink)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
