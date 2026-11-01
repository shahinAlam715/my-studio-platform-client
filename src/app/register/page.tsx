"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const PASSWORD_ERROR =
  "Password needs an uppercase letter, a lowercase letter and at least 6 characters.";

function Field({
  id,
  label,
  className,
  ...props
}: ComponentProps<"input"> & {
  id: string;
  label: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm text-gray-700 dark:text-neutral-300"
      >
        {label}
      </label>

      <Input
        id={id}
        className={className}
        {...props}
      />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputClass =
    "mt-2 h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-gold focus-visible:ring-gold/40 dark:border-white/10 dark:bg-[#141414] dark:text-white dark:placeholder:text-neutral-500";

  const passwordError =
    password.length > 0 && !PASSWORD_RULE.test(password);

  const formValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    PASSWORD_RULE.test(password);

  // Email registration
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!formValid || loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password,
        ...(photoUrl.trim() && { image: photoUrl.trim() }),
      };

      const { data, error } = await authClient.signUp.email(userData);

      if (error) {
        setErrorMessage(
          error.message || "Registration failed. Please try again."
        );
        return;
      }

      console.log("Registration successful:", data);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google registration
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
          error.message || "Google registration failed."
        );
      }
    } catch (error) {
      console.error("Google registration error:", error);

      setErrorMessage(
        "Unable to register with Google. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-[#0b0b0b]">
      <div className="mx-auto max-w-md px-6 py-16 lg:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Create your account
        </h1>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
        >
          {/* Name */}
          <Field
            id="name"
            name="name"
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />

          {/* Email */}
          <Field
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />

          {/* Photo URL */}
          <Field
            id="photo-url"
            name="image"
            label="Photo URL"
            type="url"
            placeholder="https://"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            className={inputClass}
          />

          {/* Password */}
          <div>
            <Field
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={passwordError}
              className={inputClass}
            />

            {passwordError && (
              <p role="alert" className="mt-2 text-xs text-red-500">
                {PASSWORD_ERROR}
              </p>
            )}
          </div>

          {/* Error message */}
          {errorMessage && (
            <p role="alert" className="text-sm text-red-500">
              {errorMessage}
            </p>
          )}

          {/* Register button */}
          <Button
            type="submit"
            disabled={!formValid || loading}
            className="h-11 w-full rounded-full bg-gold text-sm font-semibold text-black transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>

          {/* Google button */}
          <Button
            onClick={handleGoogle}
            type="button"
            disabled={googleLoading}
            variant="outline"
            className="h-11 w-full rounded-full border-gray-300 bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/5"
          >
            {googleLoading
              ? "Connecting..."
              : "Continue With Google"}
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-sm text-gray-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}


