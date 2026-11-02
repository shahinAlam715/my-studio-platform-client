"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoIcon from "@/components/LogoIcon";
import type { UserSession } from "@/type";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios-explore", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (!active) return;

        if (error) {
          console.error("Session Error:", error);
          setSession(null);
        } else {
          setSession(data as UserSession | null);
        }
      } catch (error) {
        if (active) {
          console.error("Failed to get session:", error);
          setSession(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Only runs on click, so reading resolvedTheme here is safe
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSignout = async () => {
    if (signingOut) return;

    try {
      setSigningOut(true);
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Sign Out Error:", error);
        return;
      }

      setSession(null);
      setMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign Out Failed:", error);
    } finally {
      setSigningOut(false);
    }
  };

  const user = session?.user;

  const navLinkClass = (href: string) => {
    const active =
      pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return `rounded-lg text-sm transition-colors ${
      active
        ? "font-semibold text-gold"
        : "text-gray-600 hover:text-gold dark:text-gray-300 dark:hover:text-gold"
    }`;
  };

  const renderAuthButtons = (mobile = false) => {
    if (loading) return null;

    if (user) {
      return (
        <div className={`flex items-center gap-3 ${mobile ? "flex-wrap" : ""}`}>
          <Avatar className="h-9 w-9 border border-gold/40">
            {user.image && (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            )}
            <AvatarFallback className="bg-gold text-black">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <Button
            type="button"
            onClick={handleSignout}
            disabled={signingOut}
            className="rounded-full bg-gold px-5 text-sm font-semibold text-black hover:bg-gold-soft"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {signingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      );
    }

    return (
      <div className={`flex gap-3 ${mobile ? "flex-col" : "items-center"}`}>
        <Link
          href="/login"
          onClick={() => setMenuOpen(false)}
          className="rounded-full border border-gray-400 px-5 py-2 text-center text-sm text-gray-800 transition-colors hover:bg-gray-100 dark:border-white/70 dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          Login
        </Link>

        <Link
          href="/register"
          onClick={() => setMenuOpen(false)}
          className="rounded-full bg-gold px-5 py-2 text-center text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
        >
          Register
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoIcon className="h-7 w-7" />
            <span className="text-lg font-bold tracking-wide">
              <span className="text-gold">Studio</span>
              <span className="text-gray-900 dark:text-white">Space</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 lg:flex xl:gap-8"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Theme Toggle: both icons rendered, CSS picks one (no hydration mismatch) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-all hover:border-gold hover:text-gold dark:border-white/20 dark:text-gray-200"
            >
              <Sun className="hidden h-5 w-5 dark:block" />
              <Moon className="block h-5 w-5 dark:hidden" />
            </button>

            {/* Desktop Auth */}
            <div className="hidden sm:block">{renderAuthButtons()}</div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-full p-2 text-gray-800 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-gray-200 bg-white px-4 pb-5 pt-3 dark:border-white/10 dark:bg-black lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-3 ${navLinkClass(link.href)}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-white/10">
              {renderAuthButtons(true)}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}