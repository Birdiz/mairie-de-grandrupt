"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { href: "/", labelKey: "home" },
  { href: "/histoire", labelKey: "histoire" },
  { href: "/actualites", labelKey: "actualites" },
  { href: "/entreprises", labelKey: "entreprises" },
  { href: "/contact", labelKey: "contact" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
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
      {/* Desktop nav */}
      <nav aria-label={t("mainNav")} className="hidden md:block">
        <ul className="flex flex-wrap gap-1">
          {navItems.map(({ href, labelKey }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-4 py-2 text-base font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground",
                  )}
                >
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile burger button */}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "rounded-md p-2 transition-colors md:hidden",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          "text-foreground",
        )}
      >
        {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      {/* Mobile menu — absolute relative to the header (which has position: relative + z-50) */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label={t("mainNav")}
        className={cn(
          "border-border bg-background absolute top-full right-0 left-0 border-b shadow-md",
          isOpen ? "block" : "hidden",
        )}
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
          {navItems.map(({ href, labelKey }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-3 text-base font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground",
                  )}
                >
                  {t(labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
