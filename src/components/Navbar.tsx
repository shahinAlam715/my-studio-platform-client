"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios-explore", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/dashboard", label: "Dashboard" }
];

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="50%" stopColor="#f5c518" />
          <stop offset="100%" stopColor="#c99a0a" />
        </linearGradient>
      </defs>
      <path d="M7.2 3h9.6L22 9.2 12 21 2 9.2 7.2 3Z" fill="url(#logo-gold)" />
      <path
        d="M7.2 3 12 9.2 16.8 3M2 9.2h20M12 9.2V21"
        fill="none"
        stroke="#0b0b0b"
        strokeOpacity=".4"
        strokeWidth="1"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoIcon className="h-7 w-7" />
            <span className="text-lg font-bold tracking-wide">
              <span className="text-gold">Studio</span>
              <span className="text-white">Space</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    active
                      ? "font-medium text-gold"
                      : "text-gray-300 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-gray-300 transition-colors hover:border-gold hover:text-gold"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
            </button>

            <Link
              href="/login"
              className="hidden rounded-full border border-white/70 px-5 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-black sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="hidden rounded-full bg-gold px-5 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-gold-soft sm:block"
            >
              Register
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              className="rounded-full p-1.5 transition-colors hover:bg-white/10 lg:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-white/10 px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center gap-2">
              <input
                autoFocus
                type="search"
                placeholder="Search studios..."
                aria-label="Search studios"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gold hover:text-gold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            aria-label="Mobile"
            className="border-t border-white/10 px-4 pb-4 pt-2 sm:px-6 lg:hidden"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "font-medium text-gold"
                          : "text-gray-300 hover:bg-white/5 hover:text-gold"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex flex-col gap-2 px-1">
              <Link
                href="/login"
                className="rounded-full border border-white/70 px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
              >
                Register
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
