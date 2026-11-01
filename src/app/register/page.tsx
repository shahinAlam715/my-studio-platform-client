"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const PASSWORD_ERROR =
  "Password needs an uppercase letter, a lowercase letter and at least 6 characters.";

const inputClass =
  "mt-2 h-11 rounded-lg border-white/10 bg-[#141414] px-4 text-sm text-white placeholder:text-neutral-500 focus-visible:border-gold focus-visible:ring-gold/40";

function Field({
  id,
  label,
  ...props
}: ComponentProps<"input"> & { id: string; label: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-neutral-300">
        {label}
      </label>
      <Input id={id} className={inputClass} {...props} />
    </div>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");

  const passwordError = password.length > 0 && !PASSWORD_RULE.test(password);
  const formValid = name && email && PASSWORD_RULE.test(password);

  const handleSubmit = async(e: React.SubmitEvent<HTMLElement>)=>{
      e.preventDefault()
      if (!formValid) return;

      const formData = new FormData(e.target)
      const userData = Object.fromEntries(formData.entries()) as {name: string, email: string, image:string, password:string}
      console.log(userData);

      const { data, error } = await authClient.signUp.email({
       ...userData
    })

    console.log(data);
    console.log(error);
     
  }

  const handleGoogle = async()=>{
    const data = await authClient.signIn.social({
    provider: "google",
  });
  console.log(data);
  }

  return (
    <section className="bg-[#0b0b0b]">
      <div className="mx-auto max-w-md px-6 py-16 lg:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create your account
        </h1>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
        >
          <Field
            id="name"
             name="name"
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Field
            id="email"
             name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Field
            id="photo-url"
             name="image"
            label="Photo URL"
            type="url"
            placeholder="https://"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
          />
          <div>
            <Field
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={passwordError}
            />
            {passwordError && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                {PASSWORD_ERROR}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-gold text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
          >
            Register
          </Button>
          <Button
          onClick={handleGoogle}
            type="button"
            variant="outline"
            className="h-11 w-full rounded-full border-white/20 bg-transparent text-sm font-semibold text-white hover:bg-white/5"
          >
            Continue With Google
          </Button>
        </form>

        <p className="mt-6 text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
