# Portfolio — Next.js + Tailwind CSS

Sitio estático (`output: 'export'`) para GitHub Pages.

- `lib/pond.js`: estanque de koi en ASCII (canvas). Ondas con ecos al mover el ratón,
  koi articulados, sombras y nenúfares. Los colores salen de las variables CSS de `app/globals.css`.
- `components/Portfolio.js`: inicio, menú vertical y una única sección que se monta debajo (scroll animado, `lib/smoothScroll.js`).
- `components/Footer.js`: © con el año actual y fecha del último commit (`next.config.js` la fija al compilar).
- `lib/storage.js`: acceso seguro a localStorage (idioma, tema y fondo animado).
- `lib/i18n.js`: textos en español e inglés.

## Tipografías

Ambas con licencia SIL Open Font License 1.1, instaladas como paquetes npm (no dependen de Google Fonts en tiempo de build):

- Zen Dots (titulares)
- Chakra Petch (interfaz)
- Share Tech Mono (ASCII y detalles)

## Recursos (`public/media/`)

Next solo sirve lo que está en `public/`, así que los recursos viven en `public/media/`:

- `public/media/experience/`: logos de las empresas (`headissue.png`, `pangostudio.png`). Son provisionales: se sustituyen por los reales con el mismo nombre.
- `public/media/cv/`: CV descargables (`esp.pdf`, `eng.pdf`). El botón de CV del footer descarga el del idioma activo.

Valores por defecto: inglés y modo oscuro (si el visitante elige otra cosa, se recuerda).
