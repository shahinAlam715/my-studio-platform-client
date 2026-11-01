
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
import { Button } from "@/components/ui/button";
import UpdateStudio from "@/components/UpdateStudio";
import DeleteStudio from "@/components/DeleteStudio";

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

export default async function DetailsPage({
  params,
}: DetailsPageProps) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/studiodata/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Studio Not Found</h2>
          <p className="mt-2 text-sm text-gray-400">
            Unable to load studio information.
          </p>
          <Link
            href="/studios-explore"
            className="inline-block mt-5 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black"
          >
            Back to Studios
          </Link>
        </div>
      </div>
    );
  }

  const data: Studio = await res.json();

  const rating = data.rating ?? 4.8;

  const galleryImages =
    data.gallery?.length
      ? data.gallery
      : [data.imageUrl, data.imageUrl, data.imageUrl];

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Back Button */}
        <Link
          href="/studios-explore"
          className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400"
        >
          <ArrowLeft size={16} />
          Back to Studios
        </Link>

        {/* Top Section */}
        <div className="grid grid-cols-2 gap-3 md:gap-6">

          {/* Image Gallery */}
          <div className="min-w-0">
            <div className="relative h-32 overflow-hidden rounded-lg bg-[#202020] sm:h-52 md:h-80">
              <Image
                src={data.imageUrl}
                alt={data.title}
                height={400}
                width={400}
                className="h-full w-full object-cover"
              />

              <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[9px] text-white">
                Main Photo
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {galleryImages.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className="h-12 overflow-hidden rounded-md bg-[#242424] sm:h-20"
                >
                  <Image
                    src={image}
                    alt={`${data.title} ${index + 1}`}
                    height={100}
                    width={100}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Booking Card */}
          <div className="h-fit rounded-xl border border-[#292929] bg-[#1b1b1d] p-3 sm:p-5">
            <h2 className="text-lg font-bold text-amber-500 sm:text-2xl">
              ${Number(data.hourlyRate).toFixed(0)}
              <span className="text-[10px] font-normal text-gray-400">
                {" "}/ hr
              </span>
            </h2>

            <p className="mt-1 text-[9px] text-gray-400 sm:text-xs">
              Security deposit: ${Number(data.securityDeposit).toFixed(0)}
            </p>

            <div className="my-3 border-t border-[#333333]" />

            {/* Owner Information */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#303033]">
                <UserRound size={14} className="text-amber-400" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold sm:text-xs">
                  Hosted by {data.ownerName}
                </p>
                <p className="truncate text-[8px] text-gray-400 sm:text-[10px]">
                  {data.ownerEmail}
                </p>
              </div>
            </div>

            <button className="mt-4 w-full rounded-full bg-amber-500 py-2 text-[9px] font-semibold text-black transition hover:bg-amber-400 sm:text-xs">
              Book Workspace Now
            </button>

            <p className="mt-2 flex items-center justify-center gap-1 text-[8px] text-gray-400">
              <ShieldCheck size={11} />
              Secure booking experience
            </p>
          </div>

        </div>

        {/* Update / Delete actions */}
        <div className="mt-5 flex flex-wrap items-start gap-3">
          <UpdateStudio studio={data} />
          <DeleteStudio id={data._id}/>
        </div>

        {/* Studio Details */}
        <div className="mt-5 max-w-3xl">

          {/* Category */}
          <span className="inline-block rounded-full bg-amber-500 px-2 py-1 text-[9px] font-semibold text-black">
            {data.category?.replace("-", " ") || "Unknown"}
          </span>

          {/* Title */}
          <h1 className="mt-2 text-xl font-bold sm:text-3xl">
            {data.title}
          </h1>

          {/* Location and Rating */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-400 sm:text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-amber-500" />
              {data.location}
            </span>

            <span className="flex items-center gap-1">
              <Users size={13} />
              Up to {data.maxCapacity} people
            </span>

            <span className="flex items-center gap-1 text-amber-400">
              <Star size={13} fill="currentColor" />
              {rating}
            </span>
          </div>

          {/* Overview */}
          <p className="mt-4 text-xs leading-6 text-gray-400 sm:text-sm">
            {data.overview}
          </p>

          {/* Amenities */}
          {data.amenities && data.amenities.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-3 text-sm font-bold sm:text-base">
                Amenities
              </h2>

              <div className="flex flex-wrap gap-2">
                {data.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[#383838] px-3 py-1.5 text-[10px] text-gray-300"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Studio Information */}
          <section className="mt-5">
            <h2 className="mb-3 text-sm font-bold sm:text-base">
              Studio Information
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#292929] bg-[#1b1b1d] p-3">
                <Clock size={16} className="mb-2 text-amber-500" />
                <p className="text-[10px] text-gray-400">Hourly Rate</p>
                <p className="mt-1 text-sm font-bold">
                  ${data.hourlyRate}/hr
                </p>
              </div>

              <div className="rounded-lg border border-[#292929] bg-[#1b1b1d] p-3">
                <ShieldCheck size={16} className="mb-2 text-amber-500" />
                <p className="text-[10px] text-gray-400">
                  Security Deposit
                </p>
                <p className="mt-1 text-sm font-bold">
                  ${data.securityDeposit}
                </p>
              </div>

              <div className="rounded-lg border border-[#292929] bg-[#1b1b1d] p-3">
                <Users size={16} className="mb-2 text-amber-500" />
                <p className="text-[10px] text-gray-400">Max Capacity</p>
                <p className="mt-1 text-sm font-bold">
                  {data.maxCapacity} People
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          {data.reviews && data.reviews.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-bold sm:text-base">
                Reviews
              </h2>

              <div className="space-y-3">
                {data.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-[#292929] pb-3"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold">
                        {review.name}
                      </p>

                      <span className="flex items-center gap-1 text-[10px] text-amber-400">
                        <Star size={11} fill="currentColor" />
                        {review.rating}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-gray-400">
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
