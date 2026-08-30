"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEMES,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/themes";

/*
 * The chosen theme lives on the <html> element, which the inline script in the
 * layout sets from localStorage before the first paint. Reading it through
 * useSyncExternalStore keeps this component in step with that attribute
 * without a second source of truth: the server snapshot is the default theme,
 * and the client snapshot is whatever is actually on the element.
 */

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
    // storage blocked: the theme still applies for this page view
  }
  for (const listener of listeners) listener();
}

/** Four swatches painted in the theme they name, so the list previews itself. */
function Swatch({ theme }: { theme: Theme }) {
  return (
    <span
      data-theme={theme}
      className="flex shrink-0 gap-0.5 rounded-sm bg-base-100 p-0.5 outline outline-base-content/20"
    >
      <span className="size-2 rounded-xs bg-base-content" />
      <span className="size-2 rounded-xs bg-primary" />
      <span className="size-2 rounded-xs bg-secondary" />
      <span className="size-2 rounded-xs bg-accent" />
    </span>
  );
}

export function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function choose(next: Theme) {
    applyTheme(next);
    // Close the dropdown the way daisyUI expects.
    (document.activeElement as HTMLElement | null)?.blur();
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
        <Swatch theme={theme} />
        <span className="hidden capitalize sm:inline">{theme}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="opacity-60"
        >
          <path
            d="M2 4l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm z-50 mt-1 max-h-[70vh] w-56 flex-nowrap overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        <li className="menu-title text-xs">Theme ({THEMES.length})</li>
        {THEMES.map((name) => (
          <li key={name}>
            <button
              type="button"
              onClick={() => choose(name)}
              className={theme === name ? "active" : ""}
              aria-current={theme === name}
            >
              <Swatch theme={name} />
              <span className="capitalize">{name}</span>
              {theme === name && <span className="ml-auto text-xs">✓</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
