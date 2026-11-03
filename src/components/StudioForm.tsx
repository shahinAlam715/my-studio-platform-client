"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import toast from "react-hot-toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = [
  { slug: "photo", label: "Photo Studios" },
  { slug: "sound-stage", label: "Sound Stages" },
  { slug: "podcast", label: "Podcast Rooms" },
  { slug: "music", label: "Music Suites" },
  { slug: "art-workshop", label: "Art Workshops" },
];

const AMENITIES = [
  "Wi-Fi",
  "Parking",
  "Green room",
  "Soundproofing",
  "Lighting kit",
];

export default function StudioForm() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [category, setCategory] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "mt-2 h-11 w-full rounded-lg border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-gold focus-visible:ring-gold/40 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-neutral-500";

  const textareaClass =
    "mt-2 min-h-[160px] w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-gold focus-visible:ring-gold/40 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-neutral-500";

  const labelClass = "text-sm text-gray-700 dark:text-neutral-300";

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = formRef.current;

    if (!form) {
      toast.error("Form not found. Please refresh the page.");
      return;
    }

    if (!category) {
      toast.error("Please select a studio category.");
      return;
    }

    // FormData must be created before any await.
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    try {
      setLoading(true);

      // Get logged-in user information.
      const { data: session } = await authClient.getSession();

      const ownerEmail = session?.user?.email;
      const ownerName = session?.user?.name;

      if (!ownerEmail) {
        throw new Error("Please login first.");
      }

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      // Prepare studio data using authenticated user's details.
      const studioData = {
        ...formValues,
        category,
        amenities,
        ownerName: ownerName || "",
        ownerEmail,
        hourlyRate: Number(formValues.hourlyRate),
        securityDeposit: Number(formValues.securityDeposit) || 0,
        maxCapacity: Number(formValues.maxCapacity) || 0,
      };

      const res = await fetch(`${API_URL}/studiodata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studioData),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || `Request failed: ${res.status}`);
      }

      toast.success("Studio published successfully!");
      router.refresh();
      form.reset();
      setCategory("");
      setAmenities([]);
      router.push("/my-listing");
    } catch (err) {
      console.error("Studio publish error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to publish studio. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 sm:p-8 dark:border-white/5 dark:bg-[#141414]"
    >
      {/* Title and Category */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClass}>
            Studio Title
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Studio name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "")}
          >
            <SelectTrigger id="category" className={inputClass}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.slug} value={option.slug}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rates */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="hourlyRate" className={labelClass}>
            Hourly Rate ($)
          </label>
          <Input
            id="hourlyRate"
            name="hourlyRate"
            type="number"
            min="0"
            required
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="securityDeposit" className={labelClass}>
            Security Deposit ($)
          </label>
          <Input
            id="securityDeposit"
            name="securityDeposit"
            type="number"
            min="0"
            placeholder="0"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="maxCapacity" className={labelClass}>
            Max Capacity
          </label>
          <Input
            id="maxCapacity"
            name="maxCapacity"
            type="number"
            min="1"
            required
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className={labelClass}>
          Location / Address
        </label>
        <Input
          id="location"
          name="location"
          type="text"
          required
          placeholder="Enter studio location"
          className={inputClass}
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className={labelClass}>
          Image URL
        </label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          className={inputClass}
        />
      </div>

      {/* Amenities */}
      <fieldset>
        <legend className={labelClass}>Amenities</legend>

        <div className="mt-2.5 flex flex-wrap gap-2.5">
          {AMENITIES.map((amenity) => {
            const selected = amenities.includes(amenity);

            return (
              <button
                key={amenity}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleAmenity(amenity)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  selected
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gold/50 dark:border-white/20 dark:bg-[#1a1a1a] dark:text-neutral-300 dark:hover:border-gold/50"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Overview */}
      <div>
        <label htmlFor="overview" className={labelClass}>
          Detailed Overview
        </label>
        <Textarea
          id="overview"
          name="overview"
          placeholder="Describe your studio..."
          className={textareaClass}
        />
      </div>

      {/* Owner information is taken from the logged-in account. */}
      <p className="text-xs text-gray-500 dark:text-neutral-400">
        Your studio will be published under your logged-in account.
      </p>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="h-11 rounded-full bg-gold px-7 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
      >
        {loading ? "Publishing..." : "Publish Studio"}
      </Button>
    </form>
  );
}
