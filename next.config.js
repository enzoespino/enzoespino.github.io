/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera un sitio 100% estático en /out, listo para GitHub Pages.
  output: "export",
  images: { unoptimized: true },

  // Si publicas en https://tu-usuario.github.io/nombre-repo (repo que NO
  // se llama tu-usuario.github.io), descomenta y ajusta esto:
  // basePath: "/nombre-repo",
  // assetPrefix: "/nombre-repo/",
};

module.exports = nextConfig;
