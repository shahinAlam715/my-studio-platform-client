"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ApiStudio = {
  _id: string | { $oid: string };
  title: string;
  category?: string;
  hourlyRate: string | number;
  location: string;
  imageUrl?: string;
  rating?: number;
};

type Studio = {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  price: number;
  image?: string;
};

const BADGE_LABELS: Record<string, string> = {
  photo: "Photo Studio",
  "sound-stage": "Film Stage",
  podcast: "Podcast Lounge",
  music: "Music Suite",
  "art-workshop": "Workshop",
};

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "photo", label: "Photo Studios" },
  { value: "sound-stage", label: "Sound Stages" },
  { value: "podcast", label: "Podcast Rooms" },
  { value: "music", label: "Music Suites" },
  { value: "art-workshop", label: "Art Workshops" },
];

const PRICE_OPTIONS = [
  { value: "all", label: "Any price" },
  { value: "under-30", label: "Under $30/hr" },
  { value: "30-60", label: "$30 – $60/hr" },
  { value: "over-60", label: "$60+/hr" },
];

const SORT_OPTIONS = [
  { value: "rated", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function mapStudio(item: ApiStudio): Studio {
  return {
    id: typeof item._id === "string" ? item._id : item._id.$oid,
    name: item.title,
    location: item.location,
    category: item.category ?? "photo",
    rating: item.rating ?? 4.5,
    price: Number(item.hourlyRate) || 0,
    image: item.imageUrl,
  };
}

const controlClass =
  "h-10 w-full rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-neutral-300 outline-none placeholder:text-neutral-500 focus:border-amber-400";

function StudioImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <>
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {(!src || failed) && (
        <span className="absolute bottom-3 left-3 text-[10px] text-neutral-400">
          Studio photo
        </span>
      )}
    </>
  );
}

export default function ExploreStudios() {
  const searchParams = useSearchParams();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    () => searchParams.get("category") ?? "all"
  );
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("rated");

  // Fetch studios (client side)
  useEffect(() => {
    const controller = new AbortController();

    async function loadStudios() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studiodata`, {
            cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: ApiStudio[] = await res.json();
        console.log(data);
        setStudios(data.map(mapStudio));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          setError("Could not load studios. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadStudios();
   
  }, []);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = studios.filter((s) => {
      const matchesSearch =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query);
      const matchesCategory = category === "all" || s.category === category;
      const matchesPrice =
        price === "all" ||
        (price === "under-30" && s.price < 30) ||
        (price === "30-60" && s.price >= 30 && s.price <= 60) ||
        (price === "over-60" && s.price > 60);
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [studios, search, category, price, sort]);

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold md:text-4xl">Explore studios</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Filter by category, price and location to find the right space.
        </p>

        {/* Filter bar */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="search"
            placeholder="Search by name or location"
            aria-label="Search studios"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={controlClass}
          />
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={controlClass}
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={controlClass}
          >
            {PRICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={controlClass}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <p className="mt-10 text-sm text-neutral-400">Loading studios...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-red-400">{error}</p>
        ) : results.length === 0 ? (
          <div className="mt-10 rounded-xl border border-white/5 bg-[#161616] p-10 text-center">
            <p className="font-semibold">No studios found</p>
            <p className="mt-1 text-sm text-neutral-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((studio) => (
              <article
                key={studio.id}
                className="overflow-hidden rounded-xl border border-white/5 bg-[#161616] transition-colors hover:border-amber-400/40"
              >
                <div className="relative h-36 bg-gradient-to-br from-amber-900/30 via-[#1c1c1c] to-[#161616]">
                  <StudioImage src={studio.image} alt={studio.name} />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-black">
                    {BADGE_LABELS[studio.category] ?? "Studio"}
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    ${studio.price} / hr
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="font-bold text-white">{studio.name}</h2>
                  <p className="mt-1 text-xs text-neutral-400">
                    {studio.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-neutral-300">
                      <span className="text-amber-400">★</span>
                      {studio.rating.toFixed(1)}
                    </span>
                    <Link
                      href={`/studios-explore/${studio.id}`}
                      className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-amber-400 hover:text-amber-400"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}