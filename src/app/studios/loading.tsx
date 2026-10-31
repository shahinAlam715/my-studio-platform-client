import StudioCardSkeleton from "@/components/StudioCardSkeleton";

export default function StudiosLoading() {
  return (
    <section className="bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Explore Studios
        </h1>
        <p className="mt-3 text-sm text-neutral-400 sm:text-base">
          Find the right room for your next shoot.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <StudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
