"use client";

import { useState, type ComponentType } from "react";
import { PlusIcon, CalendarIcon, BuildingIcon } from "lucide-react";
import StudioForm from "@/components/StudioForm";
import MyBookings from "@/components/MyBookings";
import MyListings from "@/components/MyListings";

const TABS: {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "add-studio", label: "Add Studio", icon: PlusIcon },
  { id: "my-bookings", label: "My Bookings", icon: CalendarIcon },
  { id: "my-listings", label: "My Listings", icon: BuildingIcon },
];

export default function DashboardPage() {
  const [active, setActive] = useState("add-studio");

  return (
    <section className="bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-3 text-sm text-neutral-400 sm:text-base">
          Manage your listings and bookings in one place.
        </p>

        {/* 2-column: sidebar | dynamic panel */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav
            aria-label="Dashboard"
            className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:self-start lg:overflow-visible lg:pb-0"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActive(tab.id)}
                  className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-white/5 bg-[#161616] text-neutral-300 hover:border-gold/40 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right side — switches with the active sidebar item */}
          <div className="min-w-0">
            {active === "add-studio" && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Add a new studio
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Share your space with creators.
                </p>
                <StudioForm />
              </div>
            )}
            {active === "my-bookings" && <MyBookings />}
            {active === "my-listings" && <MyListings />}
          </div>
        </div>
      </div>
    </section>
  );
}
