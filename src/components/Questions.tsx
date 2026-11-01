
"use client";

const FAQS = [
  {
    question: "Can I cancel a booking?",
    answer: "Yes, while it is still pending you can cancel from My Bookings.",
  },
  {
    question: "How do hosts get paid?",
    answer:
      "Earnings are tracked on your dashboard after each confirmed session.",
  },
];

export default function Questions() {
  return (
    <section className="bg-white transition-colors duration-300 dark:bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-24">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Questions
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition-colors duration-300 dark:border-white/5 dark:bg-[#161616]"
            >
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {faq.question}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
