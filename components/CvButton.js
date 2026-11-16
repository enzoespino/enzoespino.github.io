"use client";

import { useLanguage } from "@/context/Providers";

// Descarga el CV en el idioma activo (public/media/cv/esp.pdf y eng.pdf).
export default function CvButton() {
  const { t } = useLanguage();
  return (
    <a
      href={t.cv.href}
      download
      aria-label={t.cv.label}
      title={t.cv.label}
      className="chip flex h-9 items-center gap-2 px-3 font-mono text-sm hover:scale-105 hover:text-accent active:scale-95"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
      </svg>
      {t.cv.short}
    </a>
  );
}
