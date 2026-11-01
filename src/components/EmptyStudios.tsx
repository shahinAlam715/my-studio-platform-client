
"use client";

import Link from "next/link";

export default function EmptyStudios() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 transition-colors duration-300 dark:border-white/5 dark:bg-[#161616]">
      <h2 className="text-base font-bold text-gray-900 dark:text-white">
        No studios match your search
      </h2>

      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
        Try another category or clear your filters.
      </p>

      <Link
        href="/studios"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-black transition-colors hover:bg-gold-soft"
      >
        Explore Studios
      </Link>
    </div>
  );
}
