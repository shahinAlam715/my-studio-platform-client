
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import type { BookingCardProps } from "@/type";
import { useState } from "react";
import toast from "react-hot-toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export default function BookingCard({ booking }: BookingCardProps) {
     const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleDelete = async () => {

    const token = await getTokenFromClient()

      try {
          setLoading(true);
          
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}`,
        {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${token}`
            }
        }
    );
    if (res.ok) {
      toast.success("Success to delete Booking!")
    }
    if (!res.ok) {
        toast.error("Faild to delete Booking!")
    }
    router.push("/studios-explore")
    router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Studio could not be deleted. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const bookingDate = new Date(booking.bookingdate);

  const formattedDate = Number.isNaN(bookingDate.getTime())
    ? "Date unavailable"
    : bookingDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const formattedTime = Number.isNaN(bookingDate.getTime())
    ? ""
    : bookingDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#161616]">
      {/* Studio Image */}
      <div className="relative h-48 w-full bg-gray-100 dark:bg-[#222222] sm:h-56">
        <Image
          src={booking.imageUrl}
          alt={booking.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium capitalize text-white backdrop-blur-sm">
          {booking.category.replace("-", " ")}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-black">
          ${booking.hourlyRate}/hr
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5">
        {/* Title and Location */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
            {booking.title}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
            <MapPin size={15} className="shrink-0 text-amber-500" />
            {booking.location}
          </p>
        </div>

        {/* Booking Date */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-[#202020]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <CalendarDays size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Booking Date
            </p>

            <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
              {formattedDate}
            </p>

            {formattedTime && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400">
                <Clock size={12} />
                {formattedTime}
              </p>
            )}
          </div>
        </div>

        {/* Studio Information */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-200 p-3 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Security Deposit
            </p>

            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
              ${booking.securityDeposit}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-3 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Max Capacity
            </p>

            <p className="mt-1 flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
              <Users size={14} className="text-amber-500" />
              {booking.maxCapacity} People
            </p>
          </div>
        </div>

        {/* Customer and Owner */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Booked By
              </p>

              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {booking.userName}
              </p>

              <p className="truncate text-xs text-gray-500 dark:text-neutral-400">
                {booking.email}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Studio Owner
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
              {booking.ownerName}
            </p>

            <p className="truncate text-xs text-gray-500 dark:text-neutral-400">
              {booking.ownerEmail}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
          <div>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Hourly Rate
            </p>

            <p className="mt-1 text-lg font-bold text-amber-500">
              ${booking.hourlyRate}
              <span className="text-xs font-normal text-gray-500 dark:text-neutral-400">
                {" "}/ hour
              </span>
            </p>
          </div>

          
          <AlertDialog>
      <AlertDialogTrigger
        render={
         <button
          
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
          >
                Delete Booking
          </button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            studio from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        </div>

      </div>
    </article>
  );
}
