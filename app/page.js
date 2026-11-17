import Portfolio from "@/components/Portfolio";
import { translations } from "@/lib/i18n";
import { getStatsFor } from "@/lib/github";

// Se ejecuta al compilar: los datos de GitHub quedan escritos en la página estática.
export default async function Home() {
  const repos = translations.en.sections.projects.items.map((p) => p.repo);
  const projectStats = await getStatsFor(repos);
  return <Portfolio projectStats={projectStats} />;
}
