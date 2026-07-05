"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Bookmark, X } from "lucide-react";
import { parseSavedTrips, removeSavedTrip, SAVED_TRIPS_KEY } from "@/lib/storage";
import type { DestinationGuide } from "@/lib/types";

const TRIPS_CHANGED_EVENT = "culturecompass:trips-changed";

export function persistTrips(trips: DestinationGuide[]) {
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
  window.dispatchEvent(new Event(TRIPS_CHANGED_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(TRIPS_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(TRIPS_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useSavedTrips(): DestinationGuide[] {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(SAVED_TRIPS_KEY),
    () => null
  );
  return useMemo(() => parseSavedTrips(raw), [raw]);
}

export function SavedTrips({ onOpen }: { onOpen: (guide: DestinationGuide) => void }) {
  const trips = useSavedTrips();

  if (trips.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-12">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Saved trips</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Guides you saved earlier - reopen instantly, no waiting.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {trips.map((trip) => (
          <div
            key={trip.destinationName}
            className="flex items-center gap-1 rounded-xl border border-border bg-card py-1 pl-1 pr-2 shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => onOpen(trip)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-muted"
            >
              <Bookmark className="size-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">
                {trip.destinationName}
                <span className="ml-1.5 font-normal text-muted-foreground">{trip.country}</span>
              </span>
            </button>
            <button
              type="button"
              aria-label={`Remove ${trip.destinationName} from saved trips`}
              onClick={() => persistTrips(removeSavedTrip(trips, trip.destinationName))}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
