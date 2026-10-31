
"use client";

import { ApiStudio, Studio } from "@/type";
import { StarIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const Homefeauter = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const formattedStudios: Studio[] = data.map((item) => ({
          id: typeof item._id === "string" ? item._id : item._id.$oid,
          name: item.title,
          location: item.location,
          category: item.category ?? "other",
          rating: item.rating ?? 4.8,
          price: Number(item.hourlyRate) || 0,
          instantBook: item.instantBook ?? false,
          image: item.imageUrl ?? "/images/studio-placeholder.png",
        }));

        setStudios(formattedStudios);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Failed to load studios:", err);
        setError("Could not load studios.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudios();

    
  }, []);

  // Highest price first, then show only 4 studios
  const featuredStudios = useMemo(() => {
    return [...studios]
      .sort((a, b) => b.price - a.price)
      .slice(0, 4);
  }, [studios]);

  return (
    <section className="bg-[#0b0b0b] py-12 sm:py-16">
      <div className="container mx-auto px-4">

        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Explore Studios
            </h1>

            <p className="mt-3 text-sm text-neutral-400 sm:text-base">
              Discover premium creative spaces for your next project.
            </p>
          </div>

          <span className="text-sm text-amber-400">
            Featured Premium Studios
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="mt-10 text-center text-neutral-400">
            Loading studios...
          </p>
        )}

        {/* Error State */}
        {error && (
          <p className="mt-10 text-center text-red-500">
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && featuredStudios.length === 0 && (
          <p className="mt-10 text-center text-neutral-400">
            No studios available.
          </p>
        )}

        {/* Studio Cards */}
        {!loading && !error && featuredStudios.length > 0 && (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredStudios.map((studio) => (
                <article
                  key={studio.id}
                  className="overflow-hidden rounded-xl border border-white/5 bg-[#161616] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50"
                >
                  {/* Studio Image */}
                  <div className="relative aspect-[4/3] bg-[#202020]">
                    <Image
                      src={studio.image || "/images/studio-placeholder.png"}
                      alt={studio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {studio.instantBook && (
                      <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-black">
                        Instant Book
                      </span>
                    )}

                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      ${studio.price}/hr
                    </span>
                  </div>

                  {/* Studio Information */}
                  <div className="p-4">
                    <h2 className="font-bold text-white">
                      {studio.name}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-400">
                      {studio.location}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                        <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {studio.rating.toFixed(1)}
                      </span>

                      <Link
                        href={`/studios-explore/${studio.id}`}
                        className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-amber-400 hover:text-amber-400"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/studios-explore"
                className="group inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20"
              >
                View All Studios

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Homefeauter;
