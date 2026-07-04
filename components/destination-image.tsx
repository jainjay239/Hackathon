"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buildWikipediaSearchUrl, extractWikipediaThumbnail } from "@/lib/imageFallback";
import type { GlanceType } from "@/lib/types";

export type { GlanceType };

const CATEGORY_STYLES: Record<GlanceType, { emoji: string; gradient: string }> = {
  hero: { emoji: "🧭", gradient: "from-indigo-300 to-violet-400 dark:from-indigo-950 dark:to-violet-950" },
  heritage: { emoji: "🏛️", gradient: "from-amber-200 to-orange-300 dark:from-amber-900 dark:to-orange-950" },
  food: { emoji: "🍲", gradient: "from-rose-200 to-red-300 dark:from-rose-900 dark:to-red-950" },
  festival: { emoji: "🎉", gradient: "from-fuchsia-200 to-purple-300 dark:from-fuchsia-900 dark:to-purple-950" },
  craft: { emoji: "🧵", gradient: "from-teal-200 to-emerald-300 dark:from-teal-900 dark:to-emerald-950" },
  hiddenGem: { emoji: "💎", gradient: "from-sky-200 to-blue-300 dark:from-sky-900 dark:to-blue-950" },
  experience: { emoji: "🌟", gradient: "from-yellow-200 to-amber-300 dark:from-yellow-900 dark:to-amber-950" },
};

function useWikipediaImage(query: string) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!query) return;

    fetch(buildWikipediaSearchUrl(query))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const thumbnail = extractWikipediaThumbnail(data);
        if (thumbnail) setSrc(thumbnail);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [query]);

  return src;
}

export function DestinationImage({
  type,
  query,
  label,
  className = "aspect-video",
  children,
}: {
  type: GlanceType;
  query: string;
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const src = useWikipediaImage(query);
  const [errored, setErrored] = useState(false);
  const style = CATEGORY_STYLES[type];
  const showImage = Boolean(src) && !errored;

  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg", className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? undefined}
          alt={label}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={label}
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br text-4xl ${style.gradient}`}
        >
          <span aria-hidden="true">{style.emoji}</span>
        </div>
      )}
      {children}
    </div>
  );
}
