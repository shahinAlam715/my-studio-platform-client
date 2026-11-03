"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import type { HeroSlide } from "@/type";

const SLIDES: HeroSlide[] = [
  {
    eyebrow: "Peer-to-Peer Creative Workspaces",
    headline: "Find the room where your next shoot comes alive.",
    body: "Book photo cycloramas, sound stages, podcast lounges and recording suites by the hour, with clear pricing and instant confirmation.",
    image:
      "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Photographer working in a professional photo studio",
  },
  {
    eyebrow: "Podcast Rooms",
    headline: "Sound great from the very first take.",
    body: "Acoustically treated podcast lounges with broadcast mics, mixers and engineers on request — priced by the hour, confirmed instantly.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Studio microphone ready for a podcast recording",
  },
  {
    eyebrow: "Recording Suites",
    headline: "Cut your next record in a room that gets it.",
    body: "Music suites with live rooms, isolation booths and backline ready to go. Transparent hourly rates, no hidden fees.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Mixing console inside a professional recording studio",
  },
];

const GOLD_GLOW =
  "radial-gradient(60% 80% at 75% 40%, rgba(245, 197, 24, 0.28), transparent 70%)";

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  const pausedRef = useRef(false);

  // Track the active slide for custom indicators.
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelected(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Autoplay, paused while user hovers the hero.
  useEffect(() => {
    if (!api) return;

    const id = setInterval(() => {
      if (!pausedRef.current) {
        api.scrollNext();
      }
    }, 6000);

    return () => clearInterval(id);
  }, [api]);

  return (
    <section
      className="bg-white text-gray-900 dark:bg-black dark:text-white"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          duration: 30,
        }}
      >
        <CarouselContent>
          {SLIDES.map((slide, index) => {
            const Heading = index === 0 ? "h1" : "h2";

            return (
              <CarouselItem key={slide.eyebrow}>
                <div className="relative min-h-140 sm:min-h-150 lg:min-h-170">
                  {/* Banner Image */}
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />

                  {/* Main Overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-r from-white via-white/85 to-white/40 transition-colors duration-300 dark:from-black dark:via-black/85 dark:to-black/40"
                  />

                  {/* Bottom and Top Overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-white via-transparent to-white/60 transition-colors duration-300 dark:from-black dark:to-black/60"
                  />

                  {/* Gold Glow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background: GOLD_GLOW,
                    }}
                  />

                  {/* Content */}
                  <div className="relative mx-auto flex min-h-140 max-w-7xl flex-col justify-center px-6 pt-20 pb-28 sm:min-h-150 sm:px-6 lg:min-h-170 lg:px-8">
                    <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase sm:text-sm">
                      {slide.eyebrow}
                    </p>

                    <Heading className="mt-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-gray-950 transition-colors duration-300 sm:text-5xl lg:text-6xl dark:text-white">
                      {slide.headline}
                    </Heading>

                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-700 transition-colors duration-300 sm:text-base dark:text-neutral-300">
                      {slide.body}
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/studios-explore"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
                      >
                        Explore Studios
                      </Link>

                      <Link
                        href="/dashboard"
                        className="inline-flex h-11 items-center justify-center rounded-full border border-gray-800 px-7 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white dark:border-white/70 dark:text-white dark:hover:bg-white dark:hover:text-black"
                      >
                        Host Your Space
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Custom Dash Indicators */}
        <div className="absolute right-0 bottom-8 left-0">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 lg:px-8">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.eyebrow}
                type="button"
                aria-label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
                aria-current={index === selected ? "true" : undefined}
                onClick={() => api?.scrollTo(index)}
                className={`h-1 rounded-full transition-all ${
                  index === selected
                    ? "w-10 bg-gold"
                    : "w-7 bg-gray-400/50 hover:bg-gray-500/70 dark:bg-white/25 dark:hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  );
}
