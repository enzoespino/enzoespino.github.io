"use client";

import { useTheme, useLanguage } from "@/context/Providers";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t.theme.toLight : t.theme.toDark}
      className="glass-panel relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-ink transition-transform duration-300 ease-spring hover:scale-105 active:scale-90 dark:text-paper"
    >
      <span className={mounted ? "relative h-4 w-4" : "invisible relative h-4 w-4"}>
        {/* Sol */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 ease-spring ${
            isDark ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        >
          <path
            d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 ease-spring ${
            isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
          }`}
        >
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="2.5" x2="12" y2="4.8" />
            <line x1="12" y1="19.2" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="4.8" y2="12" />
            <line x1="19.2" y1="12" x2="21.5" y2="12" />
            <line x1="5.1" y1="5.1" x2="6.7" y2="6.7" />
            <line x1="17.3" y1="17.3" x2="18.9" y2="18.9" />
            <line x1="5.1" y1="18.9" x2="6.7" y2="17.3" />
            <line x1="17.3" y1="6.7" x2="18.9" y2="5.1" />
          </g>
        </svg>
      </span>
    </button>
  );
}
