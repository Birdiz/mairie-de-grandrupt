import Link from "next/link";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="border-border bg-background/95 relative z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-5">
        <Link
          href="/"
          className="focus-visible:ring-ring flex flex-col leading-tight focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Grandrupt — Accueil"
        >
          <span className="text-foreground text-lg font-bold md:text-xl">Grandrupt</span>
          <span className="text-muted-foreground text-xs md:text-base">Vosges · 88210</span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
