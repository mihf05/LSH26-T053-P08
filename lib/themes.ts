/**
 * Every theme daisyUI ships, in the order they appear in the picker.
 * Keep this in sync with the `themes:` list in app/globals.css -- a name here
 * that is not enabled there renders as the default theme.
 */
export const THEMES = [
  "corporate",
  "light",
  "dark",
  "business",
  "abyss",
  "acid",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "caramellatte",
  "cmyk",
  "coffee",
  "cupcake",
  "cyberpunk",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "lofi",
  "luxury",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "corporate";

/** Where the chosen theme is remembered, and the attribute it is written to. */
export const THEME_STORAGE_KEY = "theme";
export const THEME_ATTRIBUTE = "data-theme";
