"use client";

import { useLanguage } from "@/context/Providers";

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;

  return (
    <section id="contacto" className="mx-auto max-w-content px-6 py-20">
      <h2 className="font-display text-3xl text-ink dark:text-paper">{c.title}</h2>
      <p className="mt-2 max-w-md text-muted dark:text-muted-dark">{c.subtitle}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {c.items.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="glass-panel rounded-2xl p-4 transition-transform duration-300 ease-spring hover:scale-[1.02] hover:text-accent active:scale-[0.98]"
          >
            <p className="font-mono text-xs text-muted dark:text-muted-dark">
              {link.label}
            </p>
            <p className="mt-1 text-sm text-ink dark:text-paper">{link.value}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
