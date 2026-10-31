
"use client";

import { Mic2, AudioLines } from "lucide-react";

const StudioLoader = () => {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center bg-[#0b0b0b]">

      {/* Spinner */}
      <div className="relative flex h-20 w-20 items-center justify-center">

        {/* Outer Ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/10 border-t-gold" />

        {/* Inner Ring */}
        <div className="absolute inset-2 animate-[spin_2s_linear_infinite_reverse] rounded-full border-2 border-gold/20 border-b-gold/70" />

        {/* Center Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Mic2 className="h-6 w-6 animate-pulse" />
        </div>

      </div>

      {/* Loading Text */}
      <div className="mt-6 flex flex-col items-center gap-2">

        <div className="flex items-center gap-2">
          <AudioLines className="h-4 w-4 animate-pulse text-gold" />

          <p className="text-sm font-semibold tracking-[0.2em] text-white">
            STUDIO BOOKING
          </p>
        </div>

        <p className="text-xs text-neutral-500">
          Finding your perfect creative space...
        </p>

        {/* Animated Dots */}
        <div className="mt-2 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:300ms]" />
        </div>

      </div>
    </div>
  );
};

export default StudioLoader;
