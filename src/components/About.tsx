"use client";

const CARDS = [
  {
    title: "Our mission",
    body: "Make professional creative space affordable and easy to book.",
  },
  {
    title: "Our vision",
    body: "A city where every filmmaker, musician and photographer has a room to create.",
  },
  {
    title: "Our team",
    body: "A small crew of creators and engineers building the platform.",
  },
];

export default function About() {
  return (
    <section className="bg-white transition-colors duration-300 dark:bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 transition-colors duration-300 sm:text-4xl dark:text-white">
          About StudioSpace
        </h2>

        <p className="mt-3 text-sm text-gray-600 transition-colors duration-300 sm:text-base dark:text-neutral-400">
          We connect creators with the rooms that make great work possible.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 dark:border-white/5 dark:bg-[#161616]"
            >
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
