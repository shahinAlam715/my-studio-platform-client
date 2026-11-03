"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

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

const USER_MENU = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/add-studio",
    label: "Add New Studio",
    icon: PlusCircle,
  },
  {
    href: "/my-listing",
    label: "My Studio Listings",
    icon: Building2,
  },
  {
    href: "/my-bookings",
    label: "My Bookings",
    icon: CalendarDays,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
      setProfileOpen(false);
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

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const navLinkClass = (href: string) => {
    const active = isActive(href);

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
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              onMouseEnter={() => !mobile && setProfileOpen(true)}
              aria-expanded={profileOpen}
              aria-label="Open user menu"
              className="flex items-center gap-2 rounded-full border border-gray-300 p-1 pr-3 transition-colors hover:border-gold dark:border-white/20"
            >
              <Avatar className="h-9 w-9 border border-gold/40">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name || "User"} />
                )}

                <AvatarFallback className="bg-gold text-black">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <span className="hidden max-w-28 truncate text-sm font-medium text-gray-800 dark:text-white sm:block">
                {user.name || "User"}
              </span>

              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div
                onMouseLeave={() => !mobile && setProfileOpen(false)}
                className="absolute right-0 top-full z-60 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#111111]"
              >
                {/* User Info */}
                <div className="border-b border-gray-200 px-4 py-4 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-gold/40">
                      {user.image && (
                        <AvatarImage
                          src={user.image}
                          alt={user.name || "User"}
                        />
                      )}
                      <AvatarFallback className="bg-gold text-black">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {USER_MENU.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? "bg-gold/10 font-semibold text-gold"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gold dark:text-gray-300 dark:hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 p-2 dark:border-white/10">
                  <button
                    type="button"
                    onClick={handleSignout}
                    disabled={signingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {signingOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
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
            {/* Theme Toggle */}
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
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="rounded-full p-2 text-gray-800 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
