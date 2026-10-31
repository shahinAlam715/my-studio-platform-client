import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import HowItWorks from "@/components/HowItWorks";
import Questions from "@/components/Questions";
import About from "@/components/About";
import Homefeauter from "@/components/Homefeauter";




export default function Home() {
  return (
    <>
      <Hero />
      <Homefeauter/>
      <CategorySection />
      <HowItWorks />
      <Questions />
      <About />
    </>
  );
}
