"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_LINKS = [
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/dashboard", label: "Dashboard" },
];

const CATEGORIES = [
  { href: "/studios?category=photo", label: "Photo Studios" },
  { href: "/studios?category=podcast", label: "Podcast Rooms" },
  { href: "/studios?category=music", label: "Music Suites" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-white">{children}</h3>;
}

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <ColumnHeading>StudioSpace</ColumnHeading>
          <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-neutral-400">
            Book creative spaces by the hour. Built by creators, for creators.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <ColumnHeading>Quick Links</ColumnHeading>
          <ul className="mt-3 space-y-3 text-sm text-neutral-400">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <ColumnHeading>Categories</ColumnHeading>
          <ul className="mt-3 space-y-3 text-sm text-neutral-400">
            {CATEGORIES.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <ColumnHeading>Newsletter</ColumnHeading>
          <form
            className="mt-3 flex flex-col gap-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-11 rounded-lg border-white/15 bg-[#1a1a1a] px-4 text-sm text-white placeholder:text-neutral-500 focus-visible:border-gold focus-visible:ring-gold/40"
            />
            <Button
              type="submit"
              className="h-11 w-full rounded-full bg-gold text-sm font-semibold text-black/80 transition-colors hover:bg-gold-soft"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
}
