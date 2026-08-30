/**
 * Every theme daisyUI ships, in the order they appear in the picker.
 * Keep this in sync with the `themes:` list in app/globals.css -- a name here
 * that is not enabled there renders as the default theme.
 */
export const THEMES = [
  "light",
  "black",
] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "black";

/** Where the chosen theme is remembered, and the attribute it is written to. */
export const THEME_STORAGE_KEY = "theme";
export const THEME_ATTRIBUTE = "data-theme";
