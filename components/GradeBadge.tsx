/**
 * A letter grade. The reference palette is black, white and one yellow, so a
 * grade reads as a mono glyph in a hairline box -- F and AB are the only ones
 * that earn ink, because they are the ones the office acts on.
 */
const LETTER_CLASS: Record<string, string> = {
  F: "gp-grade-strong",
  AB: "gp-grade-strong",
};

const SIZE_CLASS: Record<string, string> = {
  xs: "min-w-[1.75rem] px-1 py-0.5 text-[0.65rem]",
  sm: "min-w-[2rem] px-1.5 py-0.5 text-xs",
  md: "min-w-[2.25rem] px-2 py-1 text-sm",
  lg: "min-w-[2.75rem] px-2.5 py-1.5 text-base",
};

export function GradeBadge({
  letter,
  size = "sm",
}: {
  letter: string;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`gp-grade inline-flex items-center justify-center rounded-[4px] ${SIZE_CLASS[size]} ${LETTER_CLASS[letter] ?? ""}`}
    >
      {letter}
    </span>
  );
}
