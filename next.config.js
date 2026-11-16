const { execSync } = require('child_process');

// Mes/año del último commit (MM/AA). Si git no está disponible, el de la compilación.
function lastUpdate() {
  try {
    const out = execSync('git log -1 --format=%cd --date=format:%m/%y', {
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString().trim();
    if (/^\d{2}\/\d{2}$/.test(out)) return out;
  } catch {}
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  agentRules: false, // Next 16 generaría un AGENTS.md en desarrollo; no lo queremos en el repo
  env: { NEXT_PUBLIC_LAST_UPDATE: lastUpdate() },
  images: {
    unoptimized: true, // Requerido porque GitHub Pages no soporta optimización dinámica
  },
};

module.exports = nextConfig;
