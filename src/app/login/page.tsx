"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputClass =
    "mt-2 h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-gold focus-visible:ring-gold/40 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-neutral-500";

  // Email and password login
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Invalid email or password."
        );
        return;
      }

      console.log("Login successful:", data);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogle = async () => {
    if (googleLoading) return;

    setGoogleLoading(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message || "Google login failed."
        );
      }
    } catch (error) {
      console.error("Google login error:", error);

      setErrorMessage(
        "Unable to login with Google. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-[#0b0b0b]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">

        {/* Pitch */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Welcome back to the studio.
          </h1>

          <p className="mt-4 text-sm text-gray-600 sm:text-base dark:text-neutral-400">
            Log in to manage your listings and bookings.
          </p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-colors duration-300 lg:justify-self-end dark:border-white/5 dark:bg-[#141414]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Login
          </h2>

          <form
            className="mt-6 space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm text-gray-700 dark:text-neutral-300"
              >
                Email
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm text-gray-700 dark:text-neutral-300"
              >
                Password
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </div>

            {/* Forgot password */}
            <Link
              href="/forgot-password"
              className="block text-xs font-medium text-gold hover:underline"
            >
              Forgot password?
            </Link>

            {/* Error message */}
            {errorMessage && (
              <p
                role="alert"
                className="text-sm text-red-500"
              >
                {errorMessage}
              </p>
            )}

            {/* Login button */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-full bg-gold text-sm font-semibold text-black transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Google login */}
            <Button
              onClick={handleGoogle}
              type="button"
              disabled={googleLoading}
              variant="outline"
              className="h-11 w-full rounded-full border-gray-300 bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
            >
              {googleLoading
                ? "Connecting..."
                : "Continue with Google"}
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-sm text-gray-600 dark:text-neutral-400">
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
