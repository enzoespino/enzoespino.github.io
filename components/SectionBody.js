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

function Projects({ items }) {
  return (
    <ul className="entries">
      {items.map((p) => (
        <li key={p.name} className="entry entry--plain">
          <div>
            <h3 className="entry-title">{p.name}</h3>
            <p className="entry-meta">{p.meta}</p>
            <p className="entry-text">{p.description}</p>
            <Tags items={p.tags} />
            <a className="entry-link" href={p.url} target="_blank" rel="noopener noreferrer">
              {p.url.replace("https://", "")}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Experience({ items }) {
  return (
    <ol className="entries">
      {items.map((job) => (
        <li key={job.company} className="entry">
          {/* Logo provisional: sustituir public/media/experience/*.png por el logo real. */}
          <img src={job.logo} alt="" width="56" height="56" className="entry-logo" loading="lazy" />
          <div>
            <h3 className="entry-title">{job.company}</h3>
            <p className="entry-role">{job.role}</p>
            <p className="entry-meta">
              {job.place} · {job.period}
            </p>
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

export default function SectionBody({ id, content }) {
  if (id === "projects") return <Projects items={content.items} />;
  if (id === "experience") return <Experience items={content.items} />;
  return <p className="section-text">{content.body}</p>;
}
