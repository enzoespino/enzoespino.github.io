import headissue from "@/media/headissue.jpeg";
import pangostudio from "@/media/pangostudio.jpeg";

export const translations = {
  es: {
    meta: {
      title: "Enzo Espiño - Portfolio",
      description:
        "Portfolio de Enzo Espiño. Desarrollador Full-Stack y estudiante de Ciberseguridad",
    },
    nav: {
      work: "Trabajo",
      writeups: "Proyectos",
      about: "Sobre mí",
      contact: "Contacto",
      homeAria: "Ir al inicio",
    },
    theme: {
      toLight: "Cambiar a modo claro",
      toDark: "Cambiar a modo oscuro",
    },
    hero: {
      eyebrow: "Desarrollo Full Stack · Ciberseguridad",
      greeting: "Hey, soy",
      name: "Enzo",
      statusLabel: "Disponible",
      currentlyLabel: "Actualmente",
      currentlyValue: "Especialización en Ciberseguridad",
      previouslyLabel: "Antes",
      previouslyValue: "Headissue GmbH · Pango Studio ",
      ctaProjects: "Ver proyectos",
      ctaCv: "Descargar CV",
      cvHref: "cv-es.pdf",
    },
    about: {
      title: "Sobre mí",
      paragraphs: [
        "Desarrollador Web Junior, apasionado por la programación y la ciberseguridad.",
        ""
      ],
    },
    work: {
      title: "Experiencia laboral",
      subtitle: "Mi paso por el sector",
      items: [
        {
          title: "Headissue GmbH",
          imageAlt: "Logo de Headissue GmbH",
          tagline: "Prácticas como desarrollador web en Munich",
          tags: ["Forth", "Bash", "Javascript"],
          href: "https://www.headissue.com/",
          image: headissue,
        },
        {
          title: "Pango Studio",
          imageAlt: "Logo de Pango Studio",
          tagline: "Prácticas como desarrollador web en Madrid",
          tags: ["Python", "JavaScript", "PHP"],
          href: "https://pangostudio.com/",
          image: pangostudio,
        },
      ],
    },
    side: {
      title: "Proyectos",
      subtitle: "Mis proyectos personales destacados",
      items: [
        {
          title: "Zere",
          platform: "Linux",
          tagline: "Rice de Hyprland con Quickshell para uso personal",
          href: "https://github.com/enzoespino/zere-shell",
        },
      ],
    },
    contact: {
      title: "Hablemos",
      subtitle: "",
      items: [
        { id: "email", label: "Email", href: "mailto:enzo.espcor@email.com" },
        { id: "github", label: "GitHub", href: "https://github.com/enzoespino" },
        { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/enzoespino/" },
      ],
    },
    footer: {
      built: "Construido con Next.js y Tailwind.",
      updated: "Actualizado",
    },
  },

  en: {
    meta: {
      title: "Enzo Espiño - Portfolio",
      description:
        "Enzo Espiño's Portfolio. Full-Stack Developer and Cybersecurity student",
    },
    nav: {
      work: "Work",
      writeups: "Projects",
      about: "About me",
      contact: "Contact",
      homeAria: "Go to homepage",
    },
    theme: {
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
    hero: {
      eyebrow: "Full Stack Development · Cybersecurity",
      greeting: "Hey, this is",
      name: "Enzo",
      statusLabel: "Available",
      currentlyLabel: "Currently",
      currentlyValue: "Specializing in Cybersecurity",
      previouslyLabel: "Previously",
      previouslyValue: "Headissue GmbH · Pango Studio ",
      ctaProjects: "View projects",
      ctaCv: "Download CV",
      cvHref: "cv-en.pdf",
    },
    about: {
      title: "About me",
      paragraphs: [
        "Junior Web Developer, passionate about programming and cybersecurity.",
        ""
      ],
    },
    work: {
      title: "Work Experience",
      subtitle: "My journey in the industry",
      items: [
        {
          title: "Headissue GmbH",
          imageAlt: "Headissue GmbH logo",
          tagline: "Web Development Internship in Munich",
          tags: ["Forth", "Bash", "Javascript"],
          href: "https://www.headissue.com/",
          image: headissue,
        },
        {
          title: "Pango Studio",
          imageAlt: "Pango Studio logo",
          tagline: "Web Development Internship in Madrid",
          tags: ["Python", "JavaScript", "PHP"],
          href: "https://pangostudio.com/",
          image: pangostudio,
        },
      ],
    },
    side: {
      title: "Projects",
      subtitle: "My featured personal projects",
      items: [
        {
          title: "Zere",
          platform: "Linux",
          tagline: "Hyprland with Quickshell personal rice",
          href: "#",
        },
      ],
    },
    contact: {
      title: "Let's talk",
      subtitle: "",
      items: [
        { id: "email", label: "Email", href: "mailto:enzo.espcor@email.com" },
        { id: "github", label: "GitHub", href: "https://github.com/enzoespino" },
        { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/enzoespino/" },
      ],
    },
    footer: {
      built: "Built with Next.js and Tailwind.",
      updated: "Updated",
    },
  }
}