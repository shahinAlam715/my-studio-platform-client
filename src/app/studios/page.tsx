import type { Metadata } from "next";
import EmptyStudios from "@/components/EmptyStudios";

export const metadata: Metadata = {
  title: "Explore Studios — StudioSpace",
};

export default function StudiosPage() {
  return (
    <section className="bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Explore Studios
        </h1>
        <p className="mt-3 text-sm text-neutral-400 sm:text-base">
          Find the right room for your next shoot.
        </p>

        <div className="mt-10">
          {/*
            Once this page fetches studio data:
            - render <StudioCardSkeleton /> for each card while pending
            - render <EmptyStudios /> when the filtered result list is empty
          */}
          <EmptyStudios />
        </div>
      </div>
    </section>
  );
}
