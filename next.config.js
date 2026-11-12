/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Requerido porque GitHub Pages no soporta optimización dinámica
  },
};

module.exports = nextConfig;
