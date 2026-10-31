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
    <section className="bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          About StudioSpace
        </h2>
        <p className="mt-3 text-sm text-neutral-400 sm:text-base">
          We connect creators with the rooms that make great work possible.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-white/5 bg-[#161616] p-6"
            >
              <h3 className="text-base font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
