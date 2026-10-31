import Link from "next/link";

const CATEGORIES = [
  { slug: "photo", label: "Photo Studios" },
  { slug: "sound-stage", label: "Sound Stages" },
  { slug: "podcast", label: "Podcast Rooms" },
  { slug: "music", label: "Music Suites" },
  { slug: "art-workshop", label: "Art Workshops" },
];

export default function CategorySection() {
  return (
    <section className="bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Browse by category
        </h2>
        <p className="mt-3 text-sm text-neutral-400 sm:text-base">
          Jump straight to the kind of space your project needs.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/studios?category=${category.slug}`}
              className="group rounded-xl border border-white/5 bg-[#161616] p-6 transition-colors hover:border-gold/40 hover:bg-[#1c1c1c]"
            >
              <h3 className="text-base font-bold text-white">
                {category.label}
              </h3>
              <p className="mt-2 text-sm text-neutral-400 transition-colors group-hover:text-gold">
                View spaces
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
