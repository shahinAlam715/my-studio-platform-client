
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import UpdateStudio from "@/components/UpdateStudio";

import type { StudioDetail } from "@/type";

import { Button } from "@/components/ui/button";

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

import {
  Loader2,
  MapPin,
  Users,
  Building2,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";

import toast from "react-hot-toast";

interface IStudio {
  _id: string | { $oid: string };
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  location: string;
  imageUrl?: string;
  overview?: string;
  ownerName?: string;
  ownerEmail: string;
  amenities?: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categoryLabels: Record<string, string> = {
  photo: "Photo Studios",
  "sound-stage": "Sound Stages",
  podcast: "Podcast Rooms",
  music: "Music Suites",
  "art-workshop": "Art Workshops",
};

// Get studio ID as string
const getStudioId = (studio: IStudio): string => {
  return typeof studio._id === "string"
    ? studio._id
    : studio._id.$oid;
};

// Convert API data into StudioDetail format
const normalizeStudio = (studio: IStudio): StudioDetail => {
  return {
    _id: getStudioId(studio),
    title: studio.title,
    category: studio.category || "",
    hourlyRate: String(studio.hourlyRate),
    securityDeposit: String(studio.securityDeposit ?? 0),
    maxCapacity: String(studio.maxCapacity ?? 0),
    location: studio.location,
    imageUrl: studio.imageUrl || "",
    overview: studio.overview || "",
    ownerName: studio.ownerName || "",
    ownerEmail: studio.ownerEmail,
    amenities: studio.amenities || [],
  };
};

// Get studios from API response
const getStudiosFromResponse = (result: unknown): IStudio[] => {
  if (Array.isArray(result)) {
    return result as IStudio[];
  }

  if (result && typeof result === "object") {
    const response = result as {
      data?: unknown;
      studios?: unknown;
    };

    if (Array.isArray(response.data)) {
      return response.data as IStudio[];
    }

    if (Array.isArray(response.studios)) {
      return response.studios as IStudio[];
    }
  }

  return [];
};

export default function MyListings() {
  const [data, setData] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch logged-in user's studios
  const loadMyListings = useCallback(async () => {
    try {
      setError("");

      const { data: session } = await authClient.getSession();
      const email = session?.user?.email;

      if (!email) {
        throw new Error("Please login first.");
      }

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const res = await fetch(`${API_URL}/studiodata`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          result?.message || "Failed to fetch studio listings."
        );
      }

      const studios = getStudiosFromResponse(result);

      // Filter only logged-in user's studios
      const myStudios = studios.filter(
        (studio) =>
          studio.ownerEmail?.trim().toLowerCase() ===
          email.trim().toLowerCase()
      );

      setData(myStudios);
    } catch (err) {
      console.error("My listings error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your listings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial loading
 // Initial loading
useEffect(() => {
  let ignore = false;

  async function initialLoad() {
    try {
      const { data: session } = await authClient.getSession();
      const email = session?.user?.email;

      if (!email) {
        throw new Error("Please login first.");
      }

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const res = await fetch(`${API_URL}/studiodata`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          result?.message || "Failed to fetch studio listings."
        );
      }

      const studios = getStudiosFromResponse(result);

      const myStudios = studios.filter(
        (studio) =>
          studio.ownerEmail?.trim().toLowerCase() ===
          email.trim().toLowerCase()
      );

      if (!ignore) {
        setData(myStudios);
        setError("");
      }
    } catch (err) {
      console.error("My listings error:", err);

      if (!ignore) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your listings."
        );
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  }

  void initialLoad();

  return () => {
    ignore = true;
  };
}, []);

  // Refresh listings
  const handleRefresh = async () => {
    setLoading(true);
    await loadMyListings();
  };

  // Delete studio
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Please login again.");
      }

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const res = await fetch(`${API_URL}/studiodata/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          result?.message || "Failed to delete studio."
        );
      }

      setData((current) =>
        current.filter((studio) => getStudioId(studio) !== id)
      );

      toast.success("Studio deleted successfully!");
    } catch (err) {
      console.error("Delete studio error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to delete studio."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <section className="relative space-y-7 px-4">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Listings
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Manage and update your published studio spaces.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Link
            href="/add-studio"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gold px-5 text-sm font-medium text-black transition-colors hover:bg-gold-soft"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Studio
          </Link>
        </div>
      </div>

      {/* Total Listings */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-[#141414]">
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Total Published Studios
        </p>

        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {data.length}
        </p>
      </div>

      {/* Error and Empty State */}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-12 text-center dark:border-white/10 dark:bg-[#161616]">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-amber-500" />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No Studios Found
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            You haven&apos;t published any studios yet.
          </p>

          <Link
            href="/add-studio"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-sm font-medium text-black hover:bg-gold-soft"
          >
            <Plus className="mr-2 h-4 w-4" />
            Publish Your First Studio
          </Link>
        </div>
      ) : (

        /* Studio Cards */
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {data.map((studio) => {
            const id = getStudioId(studio);

            return (
              <article
                key={id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-amber-500/40 hover:shadow-lg dark:border-white/10 dark:bg-[#141414]"
              >

                {/* Image */}
                <div className="relative h-52 bg-neutral-200 dark:bg-neutral-800">
                  {studio.imageUrl ? (
                    <Image
                      src={studio.imageUrl}
                      alt={studio.title || "Studio image"}
                      fill
                      sizes="(max-width: 1280px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 className="h-12 w-12 text-neutral-400" />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                    {categoryLabels[studio.category] || studio.category}
                  </span>
                </div>

                {/* Information */}
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {studio.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      {studio.location}
                    </p>
                  </div>

                  {/* Price and Capacity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-[#1c1c1c]">
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        Hourly Rate
                      </p>

                      <p className="mt-1 text-lg font-bold text-amber-500">
                        ${studio.hourlyRate}/hr
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-[#1c1c1c]">
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        Max Capacity
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                        <Users className="h-4 w-4 text-amber-500" />
                        {studio.maxCapacity ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Overview */}
                  {studio.overview && (
                    <p className="line-clamp-2 text-sm text-gray-500 dark:text-neutral-400">
                      {studio.overview}
                    </p>
                  )}

                  {/* Amenities */}
                  {studio.amenities && studio.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {studio.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-600 dark:text-amber-400"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Owner */}
                  <p className="border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-neutral-400">
                    Owner: {studio.ownerName || studio.ownerEmail}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-white/10">

                    <div className="flex-1">
                      <UpdateStudio
                        studio={normalizeStudio(studio)}
                        onUpdated={loadMyListings}
                      />
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-red-500/30 px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={deletingId === id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Studio?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{studio.title}</strong>? This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                            disabled={deletingId === id}
                            onClick={() => handleDelete(id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            {deletingId === id
                              ? "Deleting..."
                              : "Yes, Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
