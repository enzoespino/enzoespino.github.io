/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/portfolio', // El nombre de tu repositorio
  images: {
    unoptimized: true, // Requerido porque GitHub Pages no soporta optimización dinámica
  },
};

module.exports = nextConfig;
