"use client";

import { useLanguage } from "@/context/Providers";

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const isEn = lang === "en";

  return (
    <div
      role="group"
      aria-label={t.nav.langAria}
      className="chip relative flex h-9 items-center p-1 font-mono text-xs"
    >
      <span
        className="absolute inset-y-1 left-1 h-7 w-[34px] bg-fg transition-transform duration-500 ease-spring"
        style={{ transform: isEn ? "translateX(34px)" : "translateX(0)", borderRadius: "1px" }}
      />
      <button
        type="button"
        lang="es"
        onClick={() => setLang("es")}
        aria-pressed={!isEn}
        className={`relative z-10 w-[34px] py-1 text-center transition-colors duration-300 ${
          isEn ? "text-muted" : "text-bg"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        lang="en"
        onClick={() => setLang("en")}
        aria-pressed={isEn}
        className={`relative z-10 w-[34px] py-1 text-center transition-colors duration-300 ${
          isEn ? "text-bg" : "text-muted"
        }`}
      >
        EN
      </button>
    </div>
  );
}
