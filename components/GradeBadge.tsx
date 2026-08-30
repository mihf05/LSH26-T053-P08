const LETTER_CLASS: Record<string, string> = {
  "A+": "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
  A: "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30",
  "A-": "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
  B: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30",
  C: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
  D: "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30",
  F: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
  AB: "bg-slate-500/15 text-slate-800 dark:text-slate-300 border-slate-500/30",
};

const SIZE_CLASS: Record<string, string> = {
  xs: "px-1.5 py-0.5 text-[0.65rem]",
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base font-bold",
};

export function GradeBadge({
  letter,
  size = "sm",
}: {
  letter: string;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const styles =
    LETTER_CLASS[letter] ??
    "bg-base-300/40 text-base-content border-base-300/60";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-semibold leading-none ${SIZE_CLASS[size]} ${styles}`}
    >
      {letter}
    </span>
  );
}

