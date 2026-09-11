"use client";

import { useLanguage } from "@/context/Providers";

export default function About() {
  const { t } = useLanguage();

  return (
    <section
      id="sobre-mi"
      className="border-t border-line bg-surface dark:border-line-dark dark:bg-ink-800"
    >
      <div className="mx-auto grid max-w-content gap-10 px-6 py-20 md:grid-cols-[1fr_1fr]">
        <h2 className="font-display text-3xl text-ink dark:text-paper">
          {t.about.title}
        </h2>
        <div className="space-y-4 text-muted dark:text-muted-dark">
          {t.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
