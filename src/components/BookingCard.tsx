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
import { CalendarDays, MapPin, Clock, Users } from "lucide-react";
import type { BookingCardProps, BookingStatus } from "@/type";
import { useState } from "react";
import toast from "react-hot-toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

/** One style per reservation status, so the badge always matches the state. */
const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending:
    "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  Confirmed:
    "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
  Completed:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  Cancelled:
    "border-gray-300 bg-gray-100 text-gray-600 dark:border-white/20 dark:bg-white/5 dark:text-neutral-400",
};

export default function BookingCard({ booking, onRemoved }: BookingCardProps) {
  const [loading, setLoading] = useState(false);

  // Old documents were saved without a status — they start as "Pending"
  const [status, setStatus] = useState<BookingStatus>(
    booking.status ?? "Pending",
  );

  const router = useRouter();
  const isPending = status === "Pending";

  // Permanently remove the booking document
  const handleDelete = async () => {
    try {
      setLoading(true);

      const token = await getTokenFromClient();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}`,
        {
          method: "DELETE",
          headers: token ? { authorization: `Bearer ${token}` } : undefined,
        },
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      toast.success("Booking deleted successfully!");

      // Inside My Bookings the card removes itself; otherwise leave the page
      if (onRemoved) {
        onRemoved(booking._id);
        return;
      }

      router.push("/studios-explore");
      router.refresh();
    } catch (error) {
      console.error("Delete booking error:", error);
      toast.error("Failed to delete booking!");
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
        {/* Title, Location and Status */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              {booking.title}
            </h3>

            {/* Status badge */}
            <span
              className={`inline-block shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                STATUS_STYLES[status]
              }`}
            >
              {status}
            </span>
          </div>

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
                {" "}
                / hour
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <button
                    type="button"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    {loading ? "Canceling..." : "Cancel Booking"}
                  </button>
                }
              />

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this booking from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction onClick={handleDelete} disabled={loading}>
                    {loading ? "Canceling..." : "Cancel Booking"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </article>
  );
}
