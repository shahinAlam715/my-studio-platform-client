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

const inputClass =
  "mt-2 h-11 w-full rounded-lg border-white/10 bg-[#1a1a1a] px-4 text-sm text-white placeholder:text-neutral-500 focus-visible:border-gold focus-visible:ring-gold/40";

const textareaClass =
  "mt-2 min-h-[160px] w-full rounded-lg border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus-visible:border-gold focus-visible:ring-gold/40";

const labelClass = "text-sm text-neutral-300";

type StudioUpdate = {
  _id: string | { $oid: string };
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  overview: string;
  ownerName: string;
  ownerEmail: string;
  amenities?: string[];
};

type UpdateStudioProps = {
  studio: StudioUpdate;
};

export default function UpdateStudio({ studio }: UpdateStudioProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(studio.category);
  const [amenities, setAmenities] = useState<string[]>(studio.amenities ?? []);

  // Keep amenities from the listing even if they are not in the defaults.
  const amenityOptions = [...new Set([...AMENITIES, ...amenities])];

  // Mongo _id may arrive as extended JSON: { $oid: "..." }.
  const studioId =
    typeof studio._id === "string" ? studio._id : studio._id.$oid;

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studiodata/${studioId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...fields, category, amenities }),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      setOpen(false);
      router.refresh();
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        className="bg-amber-500 text-black hover:bg-amber-400"
        onClick={() => setOpen((current) => !current)}
      >
        Update
      </Button>

      {open && (
        <form
          className="w-full space-y-5 rounded-2xl border border-white/5 bg-[#141414] p-6 sm:p-8"
          onSubmit={handleSubmit}
        >
          <header>
            <h2 className="text-xl font-bold sm:text-2xl">Update studio</h2>
            <p className="mt-1 text-sm text-neutral-400">
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
                  className={`w-full justify-between ${inputClass}`}
                >
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
              <label htmlFor="update-hourly-rate" className={labelClass}>
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
              <label htmlFor="update-security-deposit" className={labelClass}>
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
              <label htmlFor="update-max-capacity" className={labelClass}>
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
            <legend className={labelClass}>Amenities</legend>
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
                        : "border-white/20 bg-[#1a1a1a] text-neutral-300 hover:border-gold/50"
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

          {/* Owner */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="update-owner-name" className={labelClass}>
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
              <label htmlFor="update-owner-email" className={labelClass}>
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

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

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
              className="h-11 rounded-full px-7 text-sm"
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
