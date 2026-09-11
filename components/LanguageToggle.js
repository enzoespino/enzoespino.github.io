"use client";

import { useLanguage } from "@/context/Providers";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="glass-panel relative flex h-9 items-center rounded-full p-1 font-mono text-xs">
      <span
        className="absolute inset-y-1 left-1 h-7 w-[34px] rounded-full bg-ink shadow-sm transition-transform duration-500 ease-spring dark:bg-paper"
        style={{ transform: isEn ? "translateX(34px)" : "translateX(0)" }}
      />
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-pressed={!isEn}
        className={`relative z-10 w-[34px] py-1 text-center transition-colors duration-300 ${
          isEn
            ? "text-muted dark:text-muted-dark"
            : "text-paper dark:text-ink-900"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={isEn}
        className={`relative z-10 w-[34px] py-1 text-center transition-colors duration-300 ${
          isEn
            ? "text-paper dark:text-ink-900"
            : "text-muted dark:text-muted-dark"
        }`}
      >
        EN
      </button>
    </div>
  );
}
