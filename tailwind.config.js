/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12151B", // texto principal en modo claro
          900: "#0B0D11",     // fondo en modo oscuro
          800: "#15181D",     // superficie/tarjetas en modo oscuro
        },
        paper: "#ECEEF1",     // fondo en modo claro
        surface: {
          DEFAULT: "#FFFFFF", // superficie/tarjetas en modo claro
        },
        line: {
          DEFAULT: "#D7DBE0",
          dark: "#262B33",
        },
        muted: {
          DEFAULT: "#5B6472",
          dark: "#9AA3AF",
        },
        accent: {
          DEFAULT: "#B9812B", // ámbar señal, color de marca
          strong: "#8F6220",
          soft: "#E3B15C",    // variante más clara, mejor contraste en oscuro
        },
        signal: {
          DEFAULT: "#2F6B5E",
          light: "#EAF2F0",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        content: "72rem",
      },
      borderRadius: {
        sm: "4px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
