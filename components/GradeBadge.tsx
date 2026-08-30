const LETTER_CLASS: Record<string, string> = {
  "A+": "badge-success",
  A: "badge-success badge-outline",
  "A-": "badge-info",
  B: "badge-primary badge-outline",
  C: "badge-warning",
  D: "badge-warning badge-outline",
  F: "badge-error",
  AB: "badge-neutral",
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
      className={`badge badge-${size} font-semibold ${LETTER_CLASS[letter] ?? "badge-ghost"}`}
    >
      {letter}
    </span>
  );
}
