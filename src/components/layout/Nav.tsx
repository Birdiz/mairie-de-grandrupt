"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { telHref } from "@/lib/phone";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { href: "/", labelKey: "home" },
  { href: "/histoire", labelKey: "histoire" },
  { href: "/actualites", labelKey: "actualites" },
  // Page "Entreprises" retirée du menu tant que les données ne sont pas réelles
  // (la page reste accessible par URL). Pour la rallumer : décommenter la ligne.
  // { href: "/entreprises", labelKey: "entreprises" },
  { href: "/contact", labelKey: "contact" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const tAddress = useTranslations("contact.address");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // Close on route change — pathname is external (Next.js router), effect is appropriate
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Escape key: close and return focus to burger button
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Move focus to first link when menu opens
  useEffect(() => {
    if (isOpen) {
      menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Desktop nav : liens sur toute la hauteur de l'en-tête, page active = gras + barre de 4 px */}
      <nav aria-label={t("mainNav")} className="hidden self-stretch lg:flex">
        <ul className="flex items-stretch gap-2">
          {navItems.map(({ href, labelKey }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href} className="flex">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center border-y-4 border-transparent px-3.5 text-[1.1875rem] no-underline underline-offset-[6px] hover:underline lg:px-4",
                    isActive
                      ? "border-b-primary text-primary font-bold"
                      : "text-foreground font-semibold",
                  )}
                >
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <LanguageSwitcher className="border-border ml-4 hidden border-l pl-4 lg:block" />

      {/* Mobile : bouton avec un libellé visible, qui est aussi son nom accessible */}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="border-secondary-foreground bg-card text-secondary-foreground flex min-h-12 items-center gap-2.5 rounded-sm border-2 px-3.5 text-lg font-bold lg:hidden"
      >
        <span aria-hidden="true" className="flex flex-col gap-1">
          <span className="bg-secondary-foreground h-[2.5px] w-[18px]" />
          <span className="bg-secondary-foreground h-[2.5px] w-[18px]" />
          <span className="bg-secondary-foreground h-[2.5px] w-[18px]" />
        </span>
        {isOpen ? t("closeMenu") : t("openMenu")}
      </button>

      {/* Mobile menu — absolute relative to the header (which has position: relative + z-50) */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label={t("mainNav")}
        className={cn(
          "bg-card absolute top-full right-0 left-0 h-[calc(100dvh-100%)] overflow-y-auto px-4 pt-2 pb-6 lg:hidden",
          isOpen ? "flex flex-col" : "hidden",
        )}
      >
        <ul className="flex flex-col">
          {navItems.map(({ href, labelKey }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "border-border flex min-h-15 items-center gap-3 border-b text-[1.3125rem] no-underline hover:underline",
                    isActive
                      ? "border-l-primary text-primary border-l-[5px] pl-3 font-bold"
                      : "text-foreground pl-[17px] font-semibold",
                  )}
                >
                  {t(labelKey)}
                  {isActive && (
                    <span className="text-muted-foreground text-base font-semibold">
                      {t("currentPage")}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <LanguageSwitcher variant="full" className="pt-6" />
        <a
          href={telHref(tAddress("phoneNumber"))}
          className="bg-primary text-primary-foreground hover:bg-primary-hover mt-6 flex min-h-13 items-center justify-center rounded-sm text-[1.1875rem] font-semibold no-underline hover:underline"
        >
          {t("callMairie")}
        </a>
      </nav>
    </>
  );
}
