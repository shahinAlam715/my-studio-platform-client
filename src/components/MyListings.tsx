const LISTINGS = [
  {
    id: "l1",
    title: "Sunset Photo Studio",
    category: "Photo Studios",
    rate: "$45",
    status: "Live",
  },
  {
    id: "l2",
    title: "Vinyl Music Suite",
    category: "Music Suites",
    rate: "$60",
    status: "Live",
  },
  {
    id: "l3",
    title: "Attic Art Workshop",
    category: "Art Workshops",
    rate: "$30",
    status: "Draft",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Live: "border-gold/40 bg-gold/15 text-gold",
  Draft: "border-white/20 bg-white/5 text-neutral-300",
};

export default function MyListings() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        My listings
      </h2>
      <p className="mt-2 text-sm text-neutral-400">
        Studios you&apos;ve published on StudioSpace.
      </p>

      {/* Replace with listings fetched from your backend */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {LISTINGS.map((listing) => (
          <div
            key={listing.id}
            className="rounded-xl border border-white/5 bg-[#161616] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">{listing.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {listing.category}
                </p>
              </div>
              <span
                className={`inline-block shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[listing.status]}`}
              >
                {listing.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <p className="text-sm text-neutral-400">
                <span className="font-semibold text-white">{listing.rate}</span>{" "}
                / hour
              </p>
              <button
                type="button"
                className="text-sm font-medium text-gold transition-colors hover:underline"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
