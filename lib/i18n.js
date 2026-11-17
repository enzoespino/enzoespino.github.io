export const translations = {
  es: {
    meta: {
      title: "Enzo Espiño - Portfolio",
      description:
        "Portfolio de Enzo Espiño. Desarrollador Full-Stack y estudiante de Ciberseguridad",
    },
    nav: {
      menuAria: "Secciones",
      langAria: "Idioma",
    },
    cv: { label: "Descargar CV", short: "CV", href: "/media/cv/esp.pdf" },
    pond: { hide: "Ocultar el fondo animado", show: "Mostrar el fondo animado" },
    theme: {
      toLight: "Cambiar a modo claro",
      toDark: "Cambiar a modo oscuro",
    },
    hero: {
      eyebrow: "Desarrollo Full Stack · Ciberseguridad",
      greeting: "Hey, soy Enzo.",
      timeLabel: "Madrid",
      currentlyLabel: "Actualmente",
      currentlyValue: "Especialización en Ciberseguridad",
      previouslyLabel: "Antes",
      previouslyValue: "Headissue GmbH · Pango Studio",
    },
    menu: [
      { id: "about", label: "Sobre mí" },
      { id: "projects", label: "Proyectos" },
      { id: "experience", label: "Experiencia" },
    ],
    // Esqueleto: el contenido real llega en las siguientes iteraciones.
    sections: {
      projects: {
        title: "Proyectos",
        updated: "Actualizado",
        items: [
          {
            name: "Zere Shell",
            repo: "enzoespino/zere-shell",
            status: "En desarrollo",
            // Respaldo si la API de GitHub no responde al compilar:
            version: "v0.6",
            license: "GPL-3.0",
            description:
              "Entorno de escritorio personal sobre CachyOS. La configuración del compositor Hyprland está en Lua y toda la shell en Quickshell (QML): barra, lanzador, notificaciones, panel de control, bloqueo de pantalla y fondos con tema claro/oscuro dinámico. Incluye instalador, perfiles por máquina (escritorio, portátil, VM) y una CLI propia, zere.",
            tags: ["Lua", "QML", "Hyprland", "Quickshell", "Bash", "CachyOS"],
          },
        ],
      },
      experience: {
        title: "Experiencia",
        items: [
          {
            company: "Headissue GmbH",
            logo: "/media/experience/headissue.png",
            role: "Desarrollador de Software (prácticas)",
            place: "Múnich, Alemania",
            period: "Mar – Jun 2026",
            bullets: [
              "Creación de scripts en Forth para un microcontrolador.",
              "Gestión, mantenimiento y resolución de errores en un e-commerce basado en PrestaShop.",
              "Uso diario de Bash, SSH y Git.",
            ],
            tags: ["Forth", "PrestaShop", "Bash", "SSH", "Git"],
          },
          {
            company: "Pango Studio",
            logo: "/media/experience/pangostudio.png",
            role: "Desarrollador de Software y Analista de Datos (prácticas)",
            place: "Madrid, España",
            period: "Abr – May 2025",
            bullets: [
              "Desarrollo de scripts en Python.",
              "Despliegue de webs con PHP y WordPress.",
              "Gestión e integración de APIs.",
            ],
            tags: ["Python", "PHP", "WordPress", "APIs"],
          },
        ],
      },
      about: {
        title: "Sobre mí",
        body: "Desarrollador de Software junior especializado en desarrollo web y optimización de plataformas digitales. Amplío de forma independiente mi conocimiento en ciberseguridad y software de código abierto. Con capacidad de adaptación, experiencia internacional y total disponibilidad para reubicación.",
      },
    },
    contact: {
      items: [
        { id: "email", label: "Email", href: "mailto:enzo.espcor@gmail.com" },
        { id: "github", label: "GitHub", href: "https://github.com/enzoespino" },
        { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/enzoespino/" },
      ],
    },
    footer: {
      built: "Actualizado",
      contactTitle: "Hablemos",
    },
  },

  en: {
    meta: {
      title: "Enzo Espiño - Portfolio",
      description:
        "Enzo Espiño's Portfolio. Full-Stack Developer and Cybersecurity student",
    },
    nav: {
      menuAria: "Sections",
      langAria: "Language",
    },
    cv: { label: "Download CV", short: "CV", href: "/media/cv/eng.pdf" },
    pond: { hide: "Hide the animated background", show: "Show the animated background" },
    theme: {
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
    hero: {
      eyebrow: "Full Stack Development · Cybersecurity",
      greeting: "Hey, this is Enzo.",
      timeLabel: "Madrid",
      currentlyLabel: "Currently",
      currentlyValue: "Specializing in Cybersecurity",
      previouslyLabel: "Previously",
      previouslyValue: "Headissue GmbH · Pango Studio",
    },
    menu: [
      { id: "about", label: "About me" },
      { id: "projects", label: "Projects" },
      { id: "experience", label: "Experience" },
    ],
    sections: {
      projects: {
        title: "Projects",
        updated: "Updated",
        items: [
          {
            name: "Zere Shell",
            repo: "enzoespino/zere-shell",
            status: "In development",
            // Respaldo si la API de GitHub no responde al compilar:
            version: "v0.6",
            license: "GPL-3.0",
            description:
              "A personal desktop environment on top of CachyOS. The Hyprland compositor config is written in Lua and the whole shell in Quickshell (QML): bar, launcher, notifications, control panel, lock screen and wallpapers with a dynamic light/dark theme. It ships with an installer, per-machine profiles (desktop, laptop, VM) and its own CLI, zere.",
            tags: ["Lua", "QML", "Hyprland", "Quickshell", "Bash", "CachyOS"],
          },
        ],
      },
      experience: {
        title: "Experience",
        items: [
          {
            company: "Headissue GmbH",
            logo: "/media/experience/headissue.png",
            role: "Software Developer (internship)",
            place: "Munich, Germany",
            period: "Mar – Jun 2026",
            bullets: [
              "Wrote Forth scripts for a microcontroller.",
              "Managed, maintained and fixed bugs in a PrestaShop-based e-commerce site.",
              "Daily work with Bash, SSH and Git.",
            ],
            tags: ["Forth", "PrestaShop", "Bash", "SSH", "Git"],
          },
          {
            company: "Pango Studio",
            logo: "/media/experience/pangostudio.png",
            role: "Software Developer and Data Analyst (internship)",
            place: "Madrid, Spain",
            period: "Apr – May 2025",
            bullets: [
              "Developed Python scripts.",
              "Deployed websites with PHP and WordPress.",
              "Managed and integrated APIs.",
            ],
            tags: ["Python", "PHP", "WordPress", "APIs"],
          },
        ],
      },
      about: {
        title: "About me",
        body: "Junior Software Developer focused on web development and the optimization of digital platforms. I independently expand my knowledge of cybersecurity and open-source software. Adaptable, with international experience and fully available to relocate.",
      },
    },
    contact: {
      items: [
        { id: "email", label: "Email", href: "mailto:enzo.espcor@gmail.com" },
        { id: "github", label: "GitHub", href: "https://github.com/enzoespino" },
        { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/enzoespino/" },
      ],
    },
    footer: {
      built: "Updated",
      contactTitle: "Let's talk",
    },
  },
};
