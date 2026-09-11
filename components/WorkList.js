"use client";

import { useLanguage } from "@/context/Providers";
import Image from "next/image"; // 👈 Nueva importación necesaria

export default function WorkList() {
  const { t } = useLanguage();
  const w = t.work;

  return (
    <section id="trabajo" className="mx-auto max-w-content px-6 py-20">
      <h2 className="font-display text-3xl text-ink dark:text-paper">{w.title}</h2>
      <p className="mt-2 max-w-lg text-muted dark:text-muted-dark">{w.subtitle}</p>

      <div className="mt-10 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
        {w.items.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group grid items-center gap-5 py-7 sm:grid-cols-[96px_1fr_auto]"
          >
            {/* Contenedor de la imagen que mantiene tus animaciones */}
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-line transition-transform duration-300 ease-spring group-hover:scale-[1.04] dark:border-line-dark bg-paper dark:bg-ink-800">
              {item.image && (
                <Image
                  src={item.image}
                  alt={`Logo de ${item.title}`}
                  fill
                  className="object-cover" // Asegura que la imagen llene el hueco sin deformarse
                />
              )}
            </div>

            <div>
              <h3 className="font-display text-xl text-ink dark:text-paper">
                {item.title}
              </h3>
              <p className="mt-1 text-sm italic text-muted dark:text-muted-dark">
                {item.tagline}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="glass-panel rounded-full px-2.5 py-1 font-mono text-xs text-muted dark:text-muted-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <span className="glass-panel flex h-9 w-9 items-center justify-center justify-self-end rounded-full font-mono text-lg text-muted transition-all duration-300 ease-spring group-hover:translate-x-1 group-hover:text-accent dark:text-muted-dark dark:group-hover:text-accent-soft">
              →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}