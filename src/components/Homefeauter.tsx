"use client";

import { ApiStudio, Studio } from "@/type";
import { StarIcon, ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Homefeauter = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStudios() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/studiodata`,
          {
            cache: "no-store",
          },
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
          rating: Number(item.rating) || 0,
          price: Number(item.hourlyRate) || 0,
          instantBook: item.instantBook ?? false,
          image: item.imageUrl || "/images/studio-placeholder.png",
        }));

        // Highest price first
        formattedStudios.sort((a, b) => b.price - a.price);

        if (isMounted) {
          setStudios(formattedStudios.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load studios:", err);

        if (isMounted) {
          setError("Could not load studios. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStudios();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-12 text-gray-900 transition-colors duration-300 sm:py-16 dark:bg-[#0b0b0b] dark:text-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explore Studios
            </h1>

            <p className="mt-3 text-sm text-gray-600 sm:text-base dark:text-neutral-400">
              Discover premium creative spaces for your next project.
            </p>
          </div>

          <span className="text-sm font-semibold text-amber-500">
            Top Rated Studios
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="mt-10 text-center text-gray-500 dark:text-neutral-400">
            Loading studios...
          </p>
        )}

        {/* Error State */}
        {error && <p className="mt-10 text-center text-red-500">{error}</p>}

        {/* Empty State */}
        {!loading && !error && studios.length === 0 && (
          <p className="mt-10 text-center text-gray-500 dark:text-neutral-400">
            No studios available.
          </p>
        )}

        {/* Studio Cards */}
        {!loading && !error && studios.length > 0 && (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <article
                  key={studio.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-lg dark:border-white/5 dark:bg-[#161616]"
                >
                  {/* Studio Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-[#202020]">
                    <Image
                      src={studio.image || "/images/studio-placeholder.png"}
                      alt={studio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold capitalize text-black">
                      {studio.category.replace(/-/g, " ")}
                    </span>

                    {/* Rating Badge */}
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                      <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {studio.rating.toFixed(1)}
                    </span>

                    {/* Hourly Rate */}
                    <span className="absolute right-3 bottom-3 rounded-lg bg-black/75 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
                      ${studio.price} / hr
                    </span>
                  </div>

                  {/* Studio Information */}
                  <div className="p-5">
                    <h2 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-amber-500 dark:text-white">
                      {studio.name}
                    </h2>

                    {/* Location */}
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                      <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                      <span className="line-clamp-1">{studio.location}</span>
                    </p>

                    {/* View Details */}
                    <div className="mt-5 border-t border-gray-200 pt-4 dark:border-white/10">
                      <Link
                        href={`/studios-explore/${studio.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-all hover:border-amber-400 hover:bg-amber-400 hover:text-black dark:border-white/15 dark:text-white dark:hover:border-amber-400"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
