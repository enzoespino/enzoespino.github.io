import "@fontsource/chakra-petch/latin-400.css";
import "@fontsource/chakra-petch/latin-500.css";
import "@fontsource/chakra-petch/latin-700.css";
import "@fontsource/zen-dots/latin-400.css";
import "@fontsource/share-tech-mono/latin-400.css";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { translations } from "@/lib/i18n";

const siteUrl = "https://enzoespino.github.io";
const { title, description } = translations.en.meta;

// Valores por defecto (español). Al cambiar de idioma, Providers actualiza
// el título y la descripción en el navegador.
export const viewport = {
  // Color de la barra del navegador en móvil, según el tema del sistema.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E7EAED" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1116" },
  ],
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Enzo Espiño",
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og.png`],
  },
};

// Datos estructurados para buscadores. Contenido fijo, sin entrada de usuario.
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Enzo Espiño",
  url: siteUrl,
  jobTitle: "Full-Stack Developer",
  sameAs: ["https://github.com/enzoespino", "https://www.linkedin.com/in/enzoespino/"],
});

// En producción se limita qué puede cargar la página (GitHub Pages no permite cabeceras).
// En desarrollo no se aplica porque el hot reload de Next necesita eval.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

// Oscuro por defecto: solo pasa a claro si el visitante lo eligió antes.
const themeInitScript = `
(function () {
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored !== "light") document.documentElement.classList.add("dark");
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content={csp} />
        )}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
