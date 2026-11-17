"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { translations } from "@/lib/i18n";
import { readPref, writePref } from "@/lib/storage";

const LanguageContext = createContext(null);
const ThemeContext = createContext(null);

export function Providers({ children }) {
  const [lang, setLangState] = useState("en");
  const [theme, setThemeState] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // Por defecto: inglés y modo oscuro. Al montar se recupera lo que el visitante eligió.
  useEffect(() => {
    const storedLang = readPref("lang");
    const storedTheme = readPref("theme");

    if (storedLang === "es" || storedLang === "en") {
      setLangState(storedLang);
    }

    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
    }

    setMounted(true);
  }, []);

  // Aplica el tema al <html> y lo persiste.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    writePref("theme", theme);
  }, [theme, mounted]);

  // Aplica el idioma al <html lang="..."> y lo persiste.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    writePref("lang", lang);
  }, [lang, mounted]);

  // Actualiza título y descripción de la pestaña según el idioma.
  useEffect(() => {
    if (!mounted) return;
    const { title, description } = translations[lang].meta;
    document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", description);
  }, [lang, mounted]);

  // Valores memorizados: los consumidores solo se renderizan cuando cambia algo real.
  const langValue = useMemo(
    () => ({ lang, setLang: setLangState, t: translations[lang] }),
    [lang],
  );
  // Cambio de tema con fundido rápido (View Transitions): toda la página, incluido el
  // estanque, pasa de un tema al otro en ~0,35 s en lugar de un salto brusco.
  // Sin soporte del navegador o con "reducir movimiento", el cambio es instantáneo.
  const themeValue = useMemo(() => {
    const toggleTheme = () => {
      const next = theme === "dark" ? "light" : "dark";
      const apply = () => {
        document.documentElement.classList.toggle("dark", next === "dark");
        flushSync(() => setThemeState(next));
      };
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !reduce) document.startViewTransition(apply);
      else apply();
    };
    return { theme, mounted, toggleTheme };
  }, [theme, mounted]);

  return (
    <LanguageContext.Provider value={langValue}>
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <Providers>");
  return ctx;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <Providers>");
  return ctx;
}
