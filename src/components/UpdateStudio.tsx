
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

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

import type { UpdateStudioProps } from "@/type";
import toast from "react-hot-toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

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

export default function UpdateStudio({ studio }: UpdateStudioProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState(studio.category);
  const [amenities, setAmenities] = useState<string[]>(
    studio.amenities ?? []
  );

  // Theme-aware classes
  const inputClass =
    "mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-gold focus-visible:ring-gold/40 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-neutral-500";

  const textareaClass =
    "mt-2 min-h-[160px] w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:border-gold focus-visible:ring-gold/40 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-neutral-500";

  const labelClass = "text-sm text-gray-700 dark:text-neutral-300";

  const formClass =
    "border-gray-200 bg-white text-gray-900 shadow-sm dark:border-white/5 dark:bg-[#141414] dark:text-white";

  const mutedTextClass = "text-gray-500 dark:text-neutral-400";

  // Include custom amenities already saved in the database
  const amenityOptions = [
    ...new Set([...AMENITIES, ...amenities]),
  ];

  // `_id` is always a string by the time a studio reaches this form.
  const studioId = studio._id;

  // Toggle amenities
  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  }

  // Update studio
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = await getTokenFromClient()

    const form = event.currentTarget;

    setSaving(true);

    const formData = new FormData(form);
    const fields = Object.fromEntries(formData.entries());

    const studioData = {
      ...fields,
      category,
      amenities,
      hourlyRate: Number(fields.hourlyRate),
      securityDeposit: Number(fields.securityDeposit || 0),
      maxCapacity: Number(fields.maxCapacity || 0),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studiodata/${studioId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(studioData),
        }
      );

      if (res.ok) {
        toast.success("Update Successfull!")
      }

      if (!res.ok) {
       toast.error("Failed to update studio");
      }

      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Could not save changes. Please try again.")
      console.error("Update studio error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Update Button */}
      <Button
        type="button"
        className="bg-amber-500 text-black hover:bg-amber-400"
        onClick={() => {
          setError("");
          setOpen((current) => !current);
        }}
      >
        Update
      </Button>

      {/* Update Form */}
      {open && (
        <form
          onSubmit={handleSubmit}
          className={`w-full space-y-5 rounded-2xl border p-6 transition-colors sm:p-8 ${formClass}`}
        >
          {/* Header */}
          <header>
            <h2 className="text-xl font-bold sm:text-2xl">
              Update studio
            </h2>

            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              Edit your listing details.
            </p>
          </header>

          {/* Title | Category */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="update-title" className={labelClass}>
                Title
              </label>

              <Input
                id="update-title"
                name="title"
                type="text"
                required
                defaultValue={studio.title}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="update-category" className={labelClass}>
                Category
              </label>

              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
              >
                <SelectTrigger
                  id="update-category"
                  className={inputClass}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.slug}
                      value={option.slug}
                    >
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
              <label
                htmlFor="update-hourly-rate"
                className={labelClass}
              >
                Hourly rate ($)
              </label>

              <Input
                id="update-hourly-rate"
                name="hourlyRate"
                type="number"
                min="0"
                required
                defaultValue={studio.hourlyRate}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="update-security-deposit"
                className={labelClass}
              >
                Security deposit ($)
              </label>

              <Input
                id="update-security-deposit"
                name="securityDeposit"
                type="number"
                min="0"
                defaultValue={studio.securityDeposit}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="update-max-capacity"
                className={labelClass}
              >
                Max capacity
              </label>

              <Input
                id="update-max-capacity"
                name="maxCapacity"
                type="number"
                min="1"
                defaultValue={studio.maxCapacity}
                className={inputClass}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="update-location" className={labelClass}>
              Location / address
            </label>

            <Input
              id="update-location"
              name="location"
              type="text"
              required
              defaultValue={studio.location}
              className={inputClass}
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="update-image-url" className={labelClass}>
              Image URL
            </label>

            <Input
              id="update-image-url"
              name="imageUrl"
              type="url"
              defaultValue={studio.imageUrl}
              className={inputClass}
            />
          </div>

          {/* Amenities */}
          <fieldset>
            <legend className={labelClass}>
              Amenities
            </legend>

            <div className="mt-2.5 flex flex-wrap gap-2.5">
              {amenityOptions.map((amenity) => {
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
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gold/50 dark:border-white/20 dark:bg-[#1a1a1a] dark:text-neutral-300 dark:hover:border-gold/50"
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
            <label htmlFor="update-overview" className={labelClass}>
              Detailed overview
            </label>

            <Textarea
              id="update-overview"
              name="overview"
              defaultValue={studio.overview}
              className={textareaClass}
            />
          </div>

          {/* Owner Information */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="update-owner-name"
                className={labelClass}
              >
                Owner name
              </label>

              <Input
                id="update-owner-name"
                name="ownerName"
                type="text"
                defaultValue={studio.ownerName}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="update-owner-email"
                className={labelClass}
              >
                Owner email
              </label>

              <Input
                id="update-owner-email"
                name="ownerEmail"
                type="email"
                defaultValue={studio.ownerEmail}
                className={inputClass}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 rounded-full bg-gold px-7 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={saving}
              className="h-11 rounded-full border-gray-300 px-7 text-sm text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
