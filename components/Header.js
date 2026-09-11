"use client";

import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/Providers";

export default function Header() {
  const { t } = useLanguage();

  const links = [
    { href: "#trabajo", label: t.nav.work },
    { href: "#writeups", label: t.nav.writeups },
    { href: "#sobre-mi", label: t.nav.about },
    { href: "#contacto", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-3 z-30 px-4 sm:top-4 sm:px-6">
      <div className="glass-panel mx-auto flex max-w-content items-center justify-between gap-4 rounded-full px-3 py-2 sm:px-5">
        <a
          href="#top"
          aria-label={t.nav.homeAria}
          className="group flex h-9 w-9 items-center justify-center rounded-full text-ink transition-transform duration-300 ease-spring hover:scale-105 active:scale-95 dark:text-paper"
        >
          <Logo />
        </a>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink dark:text-muted-dark dark:hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
