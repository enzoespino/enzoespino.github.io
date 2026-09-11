import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WorkList from "@/components/WorkList";
import SideProjects from "@/components/SideProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <WorkList />
        <SideProjects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
