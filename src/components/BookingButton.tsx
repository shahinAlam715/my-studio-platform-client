"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import type { BookingButtonProps } from "@/type";
import toast from "react-hot-toast";

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

export default function BookingButton({ studio }: BookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle booking confirmation
  const handleBooking = async () => {
    try {
      setLoading(true);

      // Get logged-in user session
      const { data: session } = await authClient.getSession();
      const user = session?.user;

      // Check authentication
      if (!user?.email) {
        toast.error("Please login first!");
        return;
      }

      // Get authentication token
      const token = await getTokenFromClient();

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      // Booking information
      const bookingInfo = {
        userName: user.name,
        email: user.email,
        image: user.image || "/images/default-user.png",
        bookingdate: new Date().toISOString(),
        studioId: studio._id,
        title: studio.title,
        category: studio.category,
        hourlyRate: studio.hourlyRate,
        securityDeposit: studio.securityDeposit,
        maxCapacity: studio.maxCapacity,
        location: studio.location,
        imageUrl: studio.imageUrl,
        ownerName: studio.ownerName,
        ownerEmail: studio.ownerEmail,
      };

      // Send booking request to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingInfo),
      });

      const data = await res.json();

      // Check duplicate booking
      if (res.status === 409) {
        toast.error(data.message || "You have already booked this studio!");
        router.push(`/studios-explore/${studio._id}`);
        return;
      }

      // Check other API errors
      if (!res.ok) {
        throw new Error(data.message || `Booking failed: ${res.status}`);
      }

      // Booking successful
      toast.success("Booking successful!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Booking Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            disabled={loading}
            className="mt-5 w-full rounded-full bg-amber-500 py-3 text-xs font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Booking..." : "Book Workspace Now"}
          </button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Your Booking</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to book {studio.title}? Please confirm to
            continue with your booking.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleBooking} disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
