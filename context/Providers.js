"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/i18n";

const LanguageContext = createContext(null);
const ThemeContext = createContext(null);

export function Providers({ children }) {
  const [lang, setLangState] = useState("es");
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Al montar: recupera preferencias guardadas (o detecta las del sistema).
  useEffect(() => {
    const storedLang = window.localStorage.getItem("lang");
    const storedTheme = window.localStorage.getItem("theme");

    if (storedLang === "es" || storedLang === "en") {
      setLangState(storedLang);
    }

    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }

    setMounted(true);
  }, []);

  // Aplica el tema al <html> y lo persiste.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Aplica el idioma al <html lang="..."> y lo persiste.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    window.localStorage.setItem("lang", lang);
  }, [lang, mounted]);

  const setLang = (next) => setLangState(next);
  const toggleTheme = () => setThemeState((t) => (t === "light" ? "dark" : "light"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
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
