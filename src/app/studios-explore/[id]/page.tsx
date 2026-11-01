
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Users,
  Clock,
  Star,
  UserRound,
} from "lucide-react";
import Image from "next/image";

import UpdateStudio from "@/components/UpdateStudio";
import DeleteStudio from "@/components/DeleteStudio";
import BookingButton from "@/components/BookingButton";
import { authClient } from "@/lib/auth-client";

interface Studio {
  _id: string;
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
  rating?: number;
  amenities?: string[];
  gallery?: string[];
  reviews?: {
    name: string;
    rating: number;
    comment: string;
  }[];
}

interface DetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailsPage({ params }: DetailsPageProps) {

  const { data: session, error } = await authClient.getSession()
  const user = session?.user

  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/studiodata/${id}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-gray-900 dark:bg-[#111111] dark:text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold">Studio Not Found</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Unable to load studio information.
          </p>

          <Link
            href="/studios-explore"
            className="mt-5 inline-block rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Back to Studios
          </Link>
        </div>
      </div>
    );
  }

  const data: Studio = await res.json();
  const rating = data.rating ?? 4.8;

  const galleryImages = data.gallery?.length
    ? data.gallery
    : [data.imageUrl, data.imageUrl, data.imageUrl];

  return (
    <main className="min-h-screen bg-white text-gray-900 transition-colors dark:bg-[#111111] dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/studios-explore"
          className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400"
        >
          <ArrowLeft size={16} />
          Back to Studios
        </Link>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          {/* Image Gallery */}
          <div className="min-w-0">
            <div className="relative h-56 overflow-hidden rounded-lg bg-gray-100 dark:bg-[#202020] sm:h-64 md:h-80">
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />

              <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[9px] text-white">
                Main Photo
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {galleryImages.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className="relative h-20 overflow-hidden rounded-md bg-gray-100 dark:bg-[#242424] sm:h-24"
                >
                  <Image
                    src={image}
                    alt={`${data.title} ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 30vw, 150px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Booking Card */}
          <div className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-[#292929] dark:bg-[#1b1b1d]">
            <h2 className="text-xl font-bold text-amber-500 sm:text-2xl">
              ${Number(data.hourlyRate).toFixed(0)}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                {" "} / hr
              </span>
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Security deposit: ${Number(data.securityDeposit).toFixed(0)}
            </p>

            <div className="my-4 border-t border-gray-200 dark:border-[#333333]" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-[#303033]">
                <UserRound size={16} className="text-amber-500" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold">
                  Hosted by {user?.name}
                </p>
                <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <BookingButton studio={data} />

            <p className="mt-3 flex items-center justify-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
              <ShieldCheck size={12} />
              Secure booking experience
            </p>
          </div>
        </div>

        {/* Update / Delete Actions */}
        <div className="mt-6 flex flex-wrap items-start gap-3">
          <UpdateStudio studio={data} />
          <DeleteStudio id={data._id} />
        </div>

        {/* Studio Details */}
        <div className="mt-6 max-w-3xl">
          <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold capitalize text-black">
            {data.category?.replace("-", " ") || "Unknown"}
          </span>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
            {data.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-amber-500" />
              {data.location}
            </span>

            <span className="flex items-center gap-1">
              <Users size={14} />
              Up to {data.maxCapacity} people
            </span>

            <span className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              {rating}
            </span>
          </div>

          <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
            {data.overview}
          </p>

          {/* Amenities */}
          {data.amenities && data.amenities.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-base font-bold">Amenities</h2>

              <div className="flex flex-wrap gap-2">
                {data.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 dark:border-[#383838] dark:bg-[#1b1b1d] dark:text-gray-300"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Studio Information */}
          <section className="mt-7">
            <h2 className="mb-4 text-base font-bold">Studio Information</h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#292929] dark:bg-[#1b1b1d]">
                <Clock size={18} className="mb-3 text-amber-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hourly Rate
                </p>
                <p className="mt-1 text-sm font-bold">
                  ${data.hourlyRate}/hr
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#292929] dark:bg-[#1b1b1d]">
                <ShieldCheck size={18} className="mb-3 text-amber-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Security Deposit
                </p>
                <p className="mt-1 text-sm font-bold">
                  ${data.securityDeposit}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#292929] dark:bg-[#1b1b1d]">
                <Users size={18} className="mb-3 text-amber-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max Capacity
                </p>
                <p className="mt-1 text-sm font-bold">
                  {data.maxCapacity} People
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          {data.reviews && data.reviews.length > 0 && (
            <section className="mt-7">
              <h2 className="mb-4 text-base font-bold">Reviews</h2>

              <div className="space-y-4">
                {data.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 dark:border-[#292929]"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{review.name}</p>

                      <span className="flex items-center gap-1 text-xs text-amber-500">
                        <Star size={12} fill="currentColor" />
                        {review.rating}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
