"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/checking-lists", label: "Checking lists" },
  { href: "/rules", label: "Rules" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300/80 bg-base-100/80 backdrop-blur-xl transition-colors duration-300 no-print">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="gradient-bg-primary grid size-9 place-items-center rounded-md font-bold text-white shadow-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-base-content">
                Result Processing
              </span>
            </div>
            <span className="text-[0.72rem] font-medium opacity-80 text-base-content/80">
              Result Processing and GPA Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1 bg-base-200/60 p-1 rounded-md border border-base-300/60">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 font-semibold rounded-md text-xs sm:text-sm tracking-wide transition-colors duration-200 hover:bg-base-100 hover:shadow-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pl-2 border-l border-base-300/80">
            <ThemeSwitcher />
          </div>
        </nav>

        {/* Mobile Right Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-ghost btn-square btn-sm rounded-md border border-base-300"
            aria-label="Toggle Menu"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-base-300/80 bg-base-100 p-4 md:hidden flex flex-col gap-2 animate-in slide-in-from-top duration-200">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 font-bold rounded-md text-sm text-base-content hover:bg-base-200 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
