"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/Providers";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { readPref, writePref } from "@/lib/storage";
import KoiPond from "./KoiPond";
import PondToggle from "./PondToggle";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import StatusCard from "./StatusCard";
import Footer from "./Footer";
import SectionBody from "./SectionBody";

// Estructura: el inicio ocupa una pantalla y, debajo, se monta UNA sola sección
// (la última elegida). Elegir otra sustituye a la anterior. Mientras no se
// elige ninguna, la página no tiene nada más abajo y no se puede desplazar.
export default function Portfolio() {
  const { t } = useLanguage();
  const [section, setSection] = useState(null);
  const [pondOn, setPondOn] = useState(true);

  // Recuerda la preferencia del fondo. Sin preferencia guardada, quien pide
  // "reducir movimiento" empieza con el fondo plano.
  useEffect(() => {
    const stored = readPref("pond");
    if (stored === "off") setPondOn(false);
    else if (!stored && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPondOn(false);
    }
  }, []);
  const togglePond = () =>
    setPondOn((v) => {
      writePref("pond", v ? "off" : "on");
      return !v;
    });

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const openerRef = useRef(null);
  const pendingRef = useRef(false);
  const cancelRef = useRef(null);

  const scrollTo = useCallback((y, onDone) => {
    cancelRef.current?.();
    cancelRef.current = smoothScrollTo(y, { onDone });
  }, []);

  // Baja a la sección y deja el foco en su título.
  const toSection = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    scrollTo(el.offsetTop, () => titleRef.current?.focus({ preventScroll: true }));
  }, [scrollTo]);

  // Vuelve al inicio y devuelve el foco al botón del menú que se había usado.
  const goHome = useCallback(() => {
    scrollTo(0, () => openerRef.current?.focus({ preventScroll: true }));
  }, [scrollTo]);

  const open = (id, el) => {
    openerRef.current = el;
    if (id === section) {
      toSection();
    } else {
      pendingRef.current = true;
      setSection(id); // sustituye a la sección anterior
    }
  };

  // Cuando la sección nueva ya está en el DOM, se baja hasta ella.
  useEffect(() => {
    if (section && pendingRef.current) {
      pendingRef.current = false;
      toSection();
    }
  }, [section, toSection]);

  // Esc también vuelve al inicio.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && window.scrollY > 40) goHome();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goHome]);

  const current = section ? t.sections[section] : null;

  return (
    <div className="stage" data-section={section ? "true" : "false"}>
      <KoiPond enabled={pondOn} />
      <div className="pond-veil" aria-hidden="true" />

      <header className="site-header">
        <div className="flex items-center gap-2">
          <PondToggle on={pondOn} onToggle={togglePond} />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main>
        <div className="home">
          <div className="home-veil" aria-hidden="true" />
          <div className="hero-head">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="hero-title display">{t.hero.greeting}</h1>
          </div>

          <nav className="menu" aria-label={t.nav.menuAria}>
            {t.menu.map((item) => (
              <button
                key={item.id}
                type="button"
                className="menu-item"
                onClick={(e) => open(item.id, e.currentTarget)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <StatusCard />
        </div>

        {current && (
          <section
            key={section}
            ref={sectionRef}
            className="section"
            aria-labelledby="section-title"
          >
            <div className="section-inner">
              <h2
                id="section-title"
                ref={titleRef}
                tabIndex={-1}
                className="section-title display"
              >
                {current.title}
              </h2>
              <SectionBody id={section} content={current} />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
