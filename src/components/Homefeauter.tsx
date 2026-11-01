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

  // Fetch studios
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
          id:
            typeof item._id === "string"
              ? item._id
              : item._id.$oid,
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
    <section className="bg-white py-12 text-gray-900 transition-colors duration-300 sm:py-16 dark:bg-[#0b0b0b] dark:text-white">
      <div className="container mx-auto px-4">

        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 transition-colors duration-300 sm:text-4xl dark:text-white">
              Explore Studios
            </h1>

            <p className="mt-3 text-sm text-gray-600 transition-colors duration-300 sm:text-base dark:text-neutral-400">
              Discover premium creative spaces for your next project.
            </p>
          </div>

          <span className="text-sm text-amber-500">
            Featured Premium Studios
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="mt-10 text-center text-gray-500 dark:text-neutral-400">
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
          <p className="mt-10 text-center text-gray-500 dark:text-neutral-400">
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
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 dark:border-white/5 dark:bg-[#161616]"
                >
                  {/* Studio Image */}
                  <div className="relative aspect-[4/3] bg-gray-100 dark:bg-[#202020]">
                    <Image
                      src={
                        studio.image ||
                        "/images/studio-placeholder.png"
                      }
                      alt={studio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Instant Book Badge */}
                    {studio.instantBook && (
                      <span className="absolute top-3 left-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-black">
                        Instant Book
                      </span>
                    )}

                    {/* Price Badge */}
                    <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      ${studio.price}/hr
                    </span>
                  </div>

                  {/* Studio Information */}
                  <div className="p-4">
                    <h2 className="font-bold text-gray-900 transition-colors duration-300 dark:text-white">
                      {studio.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 transition-colors duration-300 dark:text-neutral-400">
                      {studio.location}
                    </p>

                    {/* Rating and Details */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-white/5">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-neutral-300">
                        <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />

                        {studio.rating.toFixed(1)}
                      </span>

                      <Link
                        href={`/studios-explore/${studio.id}`}
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-800 transition-colors hover:border-amber-400 hover:text-amber-600 dark:border-white/15 dark:text-white dark:hover:border-amber-400 dark:hover:text-amber-400"
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
