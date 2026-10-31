"use client";

import { useState } from "react";
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

export default function StudioForm() {
  const [category, setCategory] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

 function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );

  }

  const handleSubmit = async(e: React.SubmitEvent<HTMLElement>)=>{
    e.preventDefault()

    const formData = new FormData(e.target)
    const addStudio = Object.fromEntries(formData.entries())

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studiodata`,{
      method:"POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(addStudio)
    })
    const data = await res.json()
    console.log(data);
  }


  return (
    <form
      className="mt-8 space-y-5 rounded-2xl border border-white/5 bg-[#141414] p-6 sm:p-8"
      onSubmit={handleSubmit}
    >
      {/* Title | Category */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            placeholder="0"
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
            <SelectTrigger
              id="category"
              className={`w-full justify-between ${inputClass}`}
            >
              <SelectValue placeholder="0" />
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
          <label htmlFor="hourly-rate" className={labelClass}>
            Hourly rate ($)
          </label>
          <Input
            id="hourly-rate"
            name="hourlyRate"
            type="number"
            min="0"
            required
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="security-deposit" className={labelClass}>
            Security deposit ($)
          </label>
          <Input
            id="security-deposit"
            name="securityDeposit"
            type="number"
            min="0"
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="max-capacity" className={labelClass}>
            Max capacity
          </label>
          <Input
            id="max-capacity"
            name="maxCapacity"
            type="number"
            min="1"
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className={labelClass}>
          Location / address
        </label>
        <Input
          id="location"
          name="location"
          type="text"
          required
          placeholder="0"
          className={inputClass}
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image-url" className={labelClass}>
          Image URL
        </label>
        <Input
          id="image-url"
          name="imageUrl"
          type="url"
          placeholder="0"
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
        <label htmlFor="overview" className={labelClass}>
          Detailed overview
        </label>
        <Textarea
          id="overview"
          name="overview"
          placeholder="0"
          className={textareaClass}
        />
      </div>

      {/* Owner */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="owner-name" className={labelClass}>
            Owner name
          </label>
          <Input
            id="owner-name"
            name="ownerName"
            type="text"
            defaultValue="Rafi Ahmed"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="owner-email" className={labelClass}>
            Owner email
          </label>
          <Input
            id="owner-email"
            name="ownerEmail"
            type="email"
            defaultValue="rafi@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 rounded-full bg-gold px-7 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
      >
        Publish Studio
      </Button>
    </form>
  );
}
