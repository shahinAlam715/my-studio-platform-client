"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inputClass =
  "mt-2 h-11 rounded-lg border-white/10 bg-[#1a1a1a] px-4 text-sm text-white placeholder:text-neutral-500 focus-visible:border-gold focus-visible:ring-gold/40";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="bg-[#0b0b0b]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Pitch */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Welcome back to the studio.
          </h1>
          <p className="mt-4 text-sm text-neutral-400 sm:text-base">
            Log in to manage your listings and bookings.
          </p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#141414] p-8 lg:justify-self-end">
          <h2 className="text-xl font-bold text-white">Login</h2>

          <form
            className="mt-6 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              // TODO: wire to your auth backend / login action
            }}
          >
            <div>
              <label htmlFor="email" className="text-sm text-neutral-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-neutral-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </div>

            <Link
              href="/forgot-password"
              className="block text-xs font-medium text-gold hover:underline"
            >
              Forgot password?
            </Link>

            <Button
              type="submit"
              className="h-11 w-full rounded-full bg-gold text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
            >
              Login
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-full border-white/20 bg-transparent text-sm font-semibold text-white hover:bg-white/5"
            >
              Continue with Google
            </Button>
          </form>

          <p className="mt-6 text-sm text-neutral-400">
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-gold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
