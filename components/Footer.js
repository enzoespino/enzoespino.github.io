"use client";

import { useLanguage } from "@/context/Providers";

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="border-t border-line dark:border-line-dark">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-2 px-6 py-8 font-mono text-xs text-muted dark:text-muted-dark">
  <span>© {new Date().getFullYear()} Enzo Espiño — {t.footer.built}</span>
</div>
    </footer>
  );
}