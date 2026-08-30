"use client";

import Link from "next/link";
import { useState } from "react";
import { asset } from "@/lib/landing-assets";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/checking-lists", label: "Checking lists" },
  { href: "/rules", label: "Rules" },
];

/**
 * Navigation — Figma nodes 1:380 (desktop) and 1:381 (mobile). 60px tall,
 * absolutely positioned over the gradient, 20px padding, 32px backdrop blur.
 */
export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-0 right-0 left-0 z-20 h-[60px] backdrop-blur-[32px]">
      <div className="flex h-full items-center justify-between p-[20px]">
        <Link
          href="/"
          className="font-display text-[20px] leading-none font-medium tracking-[-0.4px] text-black"
        >
          GradePoint
        </Link>

        <div className="hidden items-center gap-[20px] md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[16px] leading-[1.2] font-medium whitespace-nowrap text-black hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-[4px] hover:opacity-70"
          >
            <span className="font-display text-[16px] leading-[1.2] font-medium whitespace-nowrap text-black">
              Get started
            </span>
            <span className="flex w-[14px] items-center justify-center">
              <img
                src={asset("arrow.svg")}
                alt=""
                width={11}
                height={9}
                className="block h-[9px] w-[11.225px] -rotate-90"
              />
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="flex size-[20px] flex-col justify-center gap-[4px] md:hidden"
        >
          <span className="block h-[2px] w-full bg-black" />
          <span className="block h-[2px] w-full bg-black" />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-[16px] bg-white/90 px-[20px] py-[20px] backdrop-blur-[32px] md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-[16px] leading-[1.2] font-medium text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
