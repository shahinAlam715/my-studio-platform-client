import { Skeleton } from "@/components/ui/skeleton";

export default function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-[#141414]">
      {/* Image area */}
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-[#1a1a1a]" />
      {/* Text placeholders */}
      <div className="space-y-2.5 p-5">
        <Skeleton className="h-3.5 w-3/5 bg-[#242424]" />
        <Skeleton className="h-3 w-2/5 bg-[#1e1e1e]" />
      </div>
    </div>
  );
}
