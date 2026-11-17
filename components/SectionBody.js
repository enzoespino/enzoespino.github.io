import { useLanguage } from "@/context/Providers";

// Contenido de cada sección. El texto vive en lib/i18n.js.
function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  );
}

// Datos técnicos desde GitHub (al compilar); si faltan, los manuales de lib/i18n.js.
function Projects({ content, stats }) {
  const { lang } = useLanguage();
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <ul className="entries">
      {content.items.map((p) => {
        const s = stats?.[p.repo];
        const url = `https://github.com/${p.repo}`;
        const updated = s?.pushedAt ? `${content.updated} ${fmt.format(new Date(s.pushedAt))}` : null;
        const meta = [p.status, s?.version ?? p.version, s?.license ?? p.license, updated]
          .filter(Boolean)
          .join(" · ");
        const tags = s?.topics?.length ? s.topics : p.tags;
        return (
        <li key={p.repo} className="entry entry--plain">
          <div>
            <h3 className="entry-title">{p.name}</h3>
            <p className="entry-meta">{meta}</p>
            <p className="entry-text">{p.description}</p>
            <Tags items={tags} />
            <a className="entry-link" href={url} target="_blank" rel="noopener noreferrer">
              {url.replace("https://", "")}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </li>
        );
      })}
    </ul>
  );
}

function Experience({ items }) {
  return (
    <ol className="entries timeline">
      {items.map((job) => (
        <li key={job.company} className="entry">
          {/* Logo provisional: sustituir public/media/experience/*.png por el logo real. */}
          <img src={job.logo} alt="" width="56" height="56" className="entry-logo" loading="lazy" />
          <div>
            <div className="entry-head">
              <h3 className="entry-title">{job.company}</h3>
              <span className="entry-period">{job.period}</span>
            </div>
            <p className="entry-role">{job.role}</p>
            <p className="entry-meta">{job.place}</p>
            <ul className="entry-list">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Tags items={job.tags} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function SectionBody({ id, content, projectStats }) {
  if (id === "projects") return <Projects content={content} stats={projectStats} />;
  if (id === "experience") return <Experience items={content.items} />;
  return <p className="section-text">{content.body}</p>;
}
