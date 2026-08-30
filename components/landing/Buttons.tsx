import Link from "next/link";

/**
 * Button primary — Figma node 1:14. Black block, 16px padding, a 4px white
 * bullet, and 14px Geist Mono Medium in white.
 */
export function ButtonPrimary({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-[10px] bg-black p-[16px] transition-opacity hover:opacity-85 ${className}`}
    >
      <span className="size-[4px] shrink-0 bg-white" aria-hidden />
      <span className="font-mono text-[14px] leading-none font-medium whitespace-nowrap text-white">
        {label}
      </span>
    </Link>
  );
}

/**
 * Button secondary — Figma node 1:62. Same block, 12px padding, no bullet.
 */
export function ButtonSecondary({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center bg-black p-[12px] transition-opacity hover:opacity-85 ${className}`}
    >
      <span className="font-mono text-[14px] leading-none font-medium whitespace-nowrap text-white">
        {label}
      </span>
    </Link>
  );
}
