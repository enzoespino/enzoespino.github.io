// Datos de los repos de GitHub, leídos UNA vez al compilar (la web sigue siendo estática).
// Si la API falla o tarda, devuelve null y la web usa los datos manuales de lib/i18n.js.
const API = process.env.GITHUB_API_URL || "https://api.github.com"; // en Actions ya viene definida
const TIMEOUT_MS = 8000;

async function gh(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
  // En Actions, GITHUB_TOKEN sube el límite de la API (60/h sin token, 1000/h con él).
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`${API}/${path}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const clean = (v, re, max) => (typeof v === "string" && v.length <= max && re.test(v) ? v : null);

async function fetchRepo(repo) {
  const info = await gh(`repos/${repo}`);
  // Versión: última release; si no hay, la etiqueta más reciente.
  let version = null;
  try {
    version = (await gh(`repos/${repo}/releases/latest`)).tag_name;
  } catch {
    try {
      version = (await gh(`repos/${repo}/tags?per_page=1`))[0]?.name ?? null;
    } catch {}
  }
  const license = info.license?.spdx_id;
  return {
    topics: (info.topics ?? []).map((t) => clean(t, /^[a-z0-9-]+$/i, 50)).filter(Boolean),
    license: license && license !== "NOASSERTION" ? clean(license, /^[\w.+-]+$/, 30) : null,
    version: clean(version, /^[\w.+-]+$/, 30),
    pushedAt: clean(info.pushed_at, /^\d{4}-\d{2}-\d{2}T/, 40),
  };
}

const cache = new Map(); // una sola consulta por repo y proceso (también en `next dev`)

export function getRepoStats(repo) {
  if (!cache.has(repo)) {
    cache.set(
      repo,
      fetchRepo(repo).catch((err) => {
        console.warn(`[github] ${repo}: se usan los datos manuales (${err.message})`);
        return null;
      }),
    );
  }
  return cache.get(repo);
}

export async function getStatsFor(repos) {
  const list = await Promise.all(repos.map(getRepoStats));
  return Object.fromEntries(repos.map((r, i) => [r, list[i]]));
}
