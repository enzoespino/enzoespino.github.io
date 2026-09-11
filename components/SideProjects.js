"use client";

import { useLanguage } from "@/context/Providers";

export default function SideProjects() {
  const { t } = useLanguage();
  const s = t.side;

  return (
    <section
      id="writeups"
      className="border-t border-line bg-surface dark:border-line-dark dark:bg-ink-800"
    >
      <div className="mx-auto max-w-content px-6 py-20">
        <h2 className="font-display text-3xl text-ink dark:text-paper">{s.title}</h2>
        <p className="mt-2 max-w-lg text-muted dark:text-muted-dark">{s.subtitle}</p>

        <div className="mt-10 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
          {s.items.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group flex flex-wrap items-center justify-between gap-3 py-6"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-lg text-ink dark:text-paper">
                    {item.title}
                  </h3>
                  <span className="glass-panel rounded-full px-2.5 py-0.5 font-mono text-xs text-muted dark:text-muted-dark">
                    {item.platform}
                  </span>
                </div>
                <p className="mt-1 text-sm italic text-muted dark:text-muted-dark">
                  {item.tagline}
                </p>
              </div>
              <span className="glass-panel flex h-9 w-9 items-center justify-center rounded-full font-mono text-lg text-muted transition-all duration-300 ease-spring group-hover:translate-x-1 group-hover:text-accent dark:text-muted-dark dark:group-hover:text-accent-soft">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
