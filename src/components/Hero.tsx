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

type Slide = {
  eyebrow: string;
  headline: string;
  body: string;
  image: string;
  imageAlt: string;
};

const SLIDES: Slide[] = [
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

  // Track the active slide for the custom indicators.
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Autoplay, paused while the user hovers the hero.
  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (!pausedRef.current) api.scrollNext();
    }, 6000);
    return () => clearInterval(id);
  }, [api]);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#0b0b0b]"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <Carousel setApi={setApi} opts={{ loop: true, duration: 30 }}>
        <CarouselContent>
          {SLIDES.map((slide, index) => {
            const Heading = index === 0 ? "h1" : "h2";
            return (
              <CarouselItem key={slide.eyebrow}>
                <div className="relative min-h-[560px] sm:min-h-[600px] lg:min-h-[680px]">
                  {/* Banner */}
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                  {/* Overlays: darken for readability + brand glow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: GOLD_GLOW }}
                  />

                  {/* Content */}
                  <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-6 pt-20 pb-28 sm:min-h-[600px] sm:px-6 lg:min-h-[680px] lg:px-8">
                    <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase sm:text-sm">
                      {slide.eyebrow}
                    </p>
                    <Heading className="mt-4 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                      {slide.headline}
                    </Heading>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">
                      {slide.body}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/studios"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
                      >
                        Explore Studios
                      </Link>
                      <Link
                        href="/host"
                        className="inline-flex h-11 items-center justify-center rounded-full border border-white/70 px-7 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
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

        {/* Custom dash indicators (screenshot style) */}
        <div className="absolute right-0 bottom-8 left-0">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 lg:px-8">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.eyebrow}
                type="button"
                aria-label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
                aria-current={index === selected}
                onClick={() => api?.scrollTo(index)}
                className={`h-1 rounded-full transition-all ${
                  index === selected
                    ? "w-10 bg-gold"
                    : "w-7 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  );
}
