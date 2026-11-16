"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/Providers";
import ContactLinks from "./ContactLinks";
import CvButton from "./CvButton";

// Fecha del último commit, fijada al compilar (next.config.js).
const LAST_UPDATE = process.env.NEXT_PUBLIC_LAST_UPDATE;

// Fijo en la parte inferior: se ve igual en el inicio y en cualquier sección.
export default function Footer() {
  const { t } = useLanguage();
  // El año se corrige en el cliente, así cambia solo cada año sin necesidad de commits.
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="site-footer">
      <span className="footer-note" suppressHydrationWarning>
        © {year} Enzo Espiño — {t.footer.built} {LAST_UPDATE}
      </span>
      <div className="footer-contact">
        <span className="footer-contact-title">{t.footer.contactTitle}</span>
        <ContactLinks />
        <CvButton />
      </div>
    </footer>
  );
}
