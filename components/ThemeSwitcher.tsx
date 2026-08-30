"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEMES,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/themes";

let listeners: (() => void)[] = [];

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

function getSnapshot(): Theme {
  const current = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return current && (THEMES as readonly string[]).includes(current)
    ? (current as Theme)
    : DEFAULT_THEME;
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // storage blocked
  }
  for (const listener of listeners) listener();
}

export function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "black";

  const toggleTheme = () => {
    applyTheme(isDark ? "light" : "black");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative flex items-center justify-center size-9 rounded-md border border-base-300 bg-base-100 hover:bg-base-200 text-base-content transition-all duration-300 shadow-xs focus:outline-hidden"
    >
      {isDark ? (
        // Sun Icon for Light Mode Switch
        <svg
          className="size-4.5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon Icon for Dark Mode Switch
        <svg
          className="size-4.5 text-slate-700 dark:text-slate-200 transition-transform duration-300 -rotate-12 hover:rotate-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
