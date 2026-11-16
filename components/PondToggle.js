"use client";

import { useLanguage } from "@/context/Providers";

export default function PondToggle({ on, onToggle }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={on ? t.pond.hide : t.pond.show}
      title={on ? t.pond.hide : t.pond.show}
      className="chip flex h-9 w-9 items-center justify-center hover:scale-105 active:scale-90"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
        <path d="M3 12c3-4.5 7-5.5 11-4 2 .7 4 2.2 6 4-2 1.8-4 3.3-6 4-4 1.5-8 .5-11-4Z" />
        <path d="m20 12 2-3.2M20 12l2 3.2" />
        <circle cx="8" cy="11" r=".6" fill="currentColor" />
        <path
          d="M4 4l16 16"
          className="transition-opacity duration-300"
          style={{ opacity: on ? 0 : 1 }}
        />
      </svg>
    </button>
  );
}
