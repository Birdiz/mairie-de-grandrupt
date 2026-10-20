import { cn } from "@/lib/utils";

/** Puce « les étages » : deux étages de sapin empilés. Toujours décorative. */
export function EtagesPuce({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 16 18"
      aria-hidden="true"
      focusable="false"
      className={cn("flex-none", className)}
    >
      <path d="M8 0 L14 8 H2 Z M8 5 L16 16 H0 Z" className="fill-brand-sapin" />
    </svg>
  );
}
