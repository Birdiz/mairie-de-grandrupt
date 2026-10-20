import Link from "next/link";
import { Logo } from "./Logo";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="border-border bg-card relative z-50 border-b">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[104px] lg:px-8">
        <Link
          href="/"
          className="text-foreground flex items-center gap-2.5 no-underline md:gap-3.5"
          aria-label="Grandrupt — Accueil"
        >
          <Logo className="h-11 w-auto shrink-0 md:h-15" />
          <span className="flex flex-col">
            <span className="font-heading text-2xl leading-[1.05] font-bold md:text-[1.875rem]">
              Grandrupt
            </span>
            <span className="text-muted-foreground text-[0.9375rem] md:text-base">
              Vosges · 88210
            </span>
          </span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
