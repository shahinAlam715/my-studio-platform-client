
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { ApiStudio, Studio, StudioImageProps } from "@/type";

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

// Convert API data into Studio format
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

// Studio Image Component
function StudioImage({ src, alt }: StudioImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <>
      {src && failedSrc !== src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailedSrc(src)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {(!src || failedSrc === src) && (
        <span className="absolute bottom-3 left-3 text-[10px] text-neutral-500 dark:text-neutral-400">
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

  // Fetch Studios from API
  useEffect(() => {
    const controller = new AbortController();

    async function loadStudios() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/studiodata`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data: ApiStudio[] = await res.json();

        setStudios(data.map(mapStudio));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error(err);
          setError("Could not load studios. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudios();

    
  }, []);

  // Search, Filter and Sort
  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = studios.filter((studio) => {
      const matchesSearch =
        !query ||
        studio.name.toLowerCase().includes(query) ||
        studio.location.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || studio.category === category;

      const matchesPrice =
        price === "all" ||
        (price === "under-30" && studio.price < 30) ||
        (price === "30-60" &&
          studio.price >= 30 &&
          studio.price <= 60) ||
        (price === "over-60" && studio.price > 60);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") {
        return a.price - b.price;
      }

      if (sort === "price-desc") {
        return b.price - a.price;
      }

      return b.rating - a.rating;
    });
  }, [studios, search, category, price, sort]);

  // Light and Dark Theme Classes
  const controlClass =
    "h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-neutral-300 dark:placeholder:text-neutral-500";

  const cardClass =
    "border-gray-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#161616]";

  const headingClass = "text-gray-900 dark:text-white";

  const descriptionClass = "text-gray-500 dark:text-neutral-400";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 transition-colors dark:bg-[#0f0f0f] dark:text-white">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Explore studios
          </h1>

          <p className={`mt-2 text-sm ${descriptionClass}`}>
            Filter by category, price and location to find
            the right space.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <input
            type="search"
            placeholder="Search by name or location"
            aria-label="Search studios"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={controlClass}
          />

          {/* Category Filter */}
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={controlClass}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            aria-label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={controlClass}
          >
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            aria-label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={controlClass}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Result Count */}
        {!loading && !error && (
          <p className={`mt-5 text-xs ${descriptionClass}`}>
            Showing {results.length} of {studios.length} studios
          </p>
        )}

        {/* Loading, Error and Results */}
        {loading ? (
          <div className="mt-10 py-10 text-center">
            <p className={`text-sm ${descriptionClass}`}>
              Loading studios...
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="mt-10 rounded-xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : results.length === 0 ? (
          /* Empty State */
          <div
            className={`mt-10 rounded-xl border p-10 text-center ${cardClass}`}
          >
            <h2 className={`font-semibold ${headingClass}`}>
              No studios found
            </h2>

            <p className={`mt-2 text-sm ${descriptionClass}`}>
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setPrice("all");
                setSort("rated");
              }}
              className="mt-5 rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold text-black transition hover:bg-amber-400"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Studio Cards */
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((studio) => (
              <article
                key={studio.id}
                className={`overflow-hidden rounded-xl border transition-colors hover:border-amber-400/50 ${cardClass}`}
              >
                {/* Studio Image */}
                <div className="relative h-40 bg-gradient-to-br from-amber-900/30 via-gray-200 to-gray-100 dark:via-[#1c1c1c] dark:to-[#161616]">
                  <StudioImage
                    src={studio.image}
                    alt={studio.name}
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  />

                  {/* Category Badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-black">
                    {BADGE_LABELS[studio.category] ?? "Studio"}
                  </span>

                  {/* Hourly Price */}
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white">
                    ${studio.price} / hr
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h2 className={`font-bold ${headingClass}`}>
                    {studio.name}
                  </h2>

                  <p className={`mt-1 text-xs ${descriptionClass}`}>
                    {studio.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Rating */}
                    <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-neutral-300">
                      <span className="text-amber-400">★</span>
                      {studio.rating.toFixed(1)}
                    </span>

                    {/* Details Link */}
                    <Link
                      href={`/studios-explore/${studio.id}`}
                      className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-amber-500 hover:text-amber-600 dark:border-white/20 dark:text-white dark:hover:border-amber-400 dark:hover:text-amber-400"
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
