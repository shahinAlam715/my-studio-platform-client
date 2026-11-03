"use client";

import { useEffect, useState } from "react";
import BookingCard from "@/components/BookingCard";
import { Loader2 } from "lucide-react";
import { IBooking } from "@/type";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export default function MyBookings() {
  const [data, setData] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The card removes itself after a successful delete
  const handleRemoved = (id: string) => {
    setData((current) => current.filter((booking) => booking._id !== id));
  };

  useEffect(() => {
    let ignore = false;

    async function loadBookings() {
      try {
        const token = await getTokenFromClient();
        // Get logged-in user session
        const { data: session } = await authClient.getSession();

        const email = session?.user?.email;

        if (!email) {
          throw new Error("Please login first.");
        }

        // Fetch bookings using dynamic email
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/${encodeURIComponent(email)}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const bookings: IBooking[] = await res.json();

        if (!ignore) {
          setData(bookings);
        }
      } catch (error) {
        console.error("Booking fetch error:", error);

        if (!ignore) {
          setError("Unable to load bookings.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        My Bookings
      </h2>

      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
        Your upcoming and past studio sessions.
      </p>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-12 text-center dark:border-white/10 dark:bg-[#161616]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No bookings found
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            You havent booked any studios yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {data.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onRemoved={handleRemoved}
            />
          ))}
        </div>
      )}
    </section>
  );
}
