const BOOKINGS = [
  {
    id: "b1",
    studio: "Sunset Photo Studio",
    date: "Nov 12, 2026",
    time: "2:00 PM – 6:00 PM",
    status: "Confirmed",
    total: "$180",
  },
  {
    id: "b2",
    studio: "The Sound Loft",
    date: "Nov 18, 2026",
    time: "10:00 AM – 12:00 PM",
    status: "Pending",
    total: "$90",
  },
  {
    id: "b3",
    studio: "Vinyl Music Suite",
    date: "Oct 28, 2026",
    time: "9:00 AM – 1:00 PM",
    status: "Completed",
    total: "$140",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "border-gold/40 bg-gold/15 text-gold",
  Pending: "border-white/20 bg-white/5 text-neutral-300",
  Completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
};

export default function MyBookings() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        My bookings
      </h2>
      <p className="mt-2 text-sm text-neutral-400">
        Your upcoming and past studio sessions.
      </p>

      {/* Replace with bookings fetched from your backend */}
      <div className="mt-6 space-y-4">
        {BOOKINGS.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#161616] p-5"
          >
            <div>
              <h3 className="font-bold text-white">{booking.studio}</h3>
              <p className="mt-1 text-sm text-neutral-400">
                {booking.date} · {booking.time}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
              >
                {booking.status}
              </span>
              <p className="mt-1.5 text-sm font-semibold text-white">
                {booking.total}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
