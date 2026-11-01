
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface BookingButtonProps {
  studio: Studio;
}

export default function BookingButton({ studio }: BookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleBooking = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data: session } = await authClient.getSession();
      const user = session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const info = {
        userName: user.name,
        email: user.email,
        image: user.image,
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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(info),
        },
      );

      if (!res.ok) {
        throw new Error("Booking could not be completed.");
      }

      setMessage("Booking successful!");
      router.push('/dashboard')
      router.refresh();
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleBooking}
        type="button"
        disabled={loading}
        className="mt-5 w-full rounded-full bg-amber-500 py-3 text-xs font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Booking..." : "Book Workspace Now"}
      </button>

      {message && (
        <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </>
  );
}
