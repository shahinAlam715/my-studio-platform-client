import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";
import Questions from "@/components/Questions";

export const metadata: Metadata = {
  title: "How It Works — StudioSpace",
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorks />
      <Questions />
    </>
  );
}
