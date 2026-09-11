"use client";

import { useLanguage } from "@/context/Providers";

export default function Hero() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-content items-center px-6 py-24">
      <div className="grid w-full gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <p className="mb-4 font-mono text-sm text-accent dark:text-accent-soft">
            {h.eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink dark:text-paper md:text-6xl">
            {h.greeting} {h.name}.
          </h1>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#trabajo"
              className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 dark:bg-paper dark:text-ink-900"
            >
              {h.ctaProjects}
            </a>
            <a
              href="/cv.pdf"
              className="glass-panel rounded-full px-5 py-2.5 text-sm text-ink transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 dark:text-paper"
            >
              {h.ctaCv}
            </a>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 font-mono text-sm text-ink dark:text-paper">
          <div className="mb-4 flex items-center gap-2 border-b border-line/60 pb-3 text-muted dark:border-line-dark/60 dark:text-muted-dark">
            <span className="h-2 w-2 rounded-full bg-signal" />
            {h.statusLabel}
          </div>
          <dl className="space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="text-muted dark:text-muted-dark">{h.currentlyLabel}</dt>
              <dd className="text-right">{h.currentlyValue}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted dark:text-muted-dark">{h.previouslyLabel}</dt>
              <dd className="text-right">{h.previouslyValue}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted dark:text-muted-dark">{h.statLabel}</dt>
              <dd>{h.statValue}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
