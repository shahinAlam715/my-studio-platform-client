import Link from "next/link";
import { CrosshairIcon } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0b0b0b] px-6 py-24 text-center">
      {/* Viewfinder icon in a gold frame */}
      <div className="flex h-20 w-28 items-center justify-center rounded-xl border border-gold sm:h-24 sm:w-32">
        <CrosshairIcon className="h-9 w-9 text-gold sm:h-10 sm:w-10" />
      </div>

      <h1 className="mt-8 text-6xl font-bold tracking-tight text-white sm:text-7xl">
        404
      </h1>

      <p className="mt-4 max-w-md text-sm text-neutral-400 sm:text-base">
        This set is empty. The page you wanted has wrapped and left the
        building.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
      >
        Return to Home
      </Link>
    </section>
  );
}
