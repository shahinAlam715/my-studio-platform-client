"use client";

const STEPS = [
  {
    number: "01",
    title: "Discover spaces",
    body: "Search and filter by category, price and city.",
  },
  {
    number: "02",
    title: "Select shoot hours",
    body: "Pick a date and time slot that is open.",
  },
  {
    number: "03",
    title: "Book instantly",
    body: "Pay a clear total with the deposit shown upfront.",
  },
  {
    number: "04",
    title: "Create and produce",
    body: "Arrive, set up and make your work.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white transition-colors duration-300 dark:bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          How StudioSpace works
        </h2>

        <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400 sm:text-base">
          Simple for creators, simple for hosts.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 dark:border-white/5 dark:bg-[#161616]"
            >
              <p className="text-lg font-bold text-gold">{step.number}</p>

              <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
