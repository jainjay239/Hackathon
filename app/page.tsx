"use client";

import { useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DestinationImage } from "@/components/destination-image";
import { DestinationGuideView } from "@/components/destination-guide";
import { PreferenceFilters, type PreferenceFiltersValue } from "@/components/preference-filters";
import { PRESET_DESTINATIONS } from "@/lib/destinations";
import { formatItinerary } from "@/lib/formatters";
import { mergeSavedTrip, parseSavedTrips, SAVED_TRIPS_KEY } from "@/lib/storage";
import type { DestinationGuide } from "@/lib/types";

const EMPTY_PREFERENCES: PreferenceFiltersValue = {
  tripLength: "",
  travelerType: "",
  budget: "",
  weather: "",
  mood: "",
  culturalInterests: [],
  comfortNeeds: [],
};

function DestinationCard({
  name,
  country,
  tag,
  imageQuery,
  onSelect,
  disabled,
}: {
  name: string;
  country: string;
  tag: string;
  imageQuery: string;
  onSelect: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="group block w-full overflow-hidden rounded-2xl text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
    >
      <DestinationImage
        type="hero"
        query={imageQuery}
        label={`${name}, ${country}`}
        className="aspect-square rounded-2xl transition-transform duration-300 group-hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-lg font-semibold text-white drop-shadow">{name}</p>
          <p className="flex items-center gap-1 text-xs text-white/80">
            <MapPin className="size-3" aria-hidden="true" />
            {country}
          </p>
          <p className="mt-1 text-xs leading-snug text-white/70">{tag}</p>
        </div>
      </DestinationImage>
    </button>
  );
}

function LoadingGuide({ destination }: { destination: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm font-medium text-foreground">
        Consulting a local cultural guide for {destination}...
      </p>
      <div className="grid w-full grid-cols-3 gap-3">
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [preferences, setPreferences] = useState<PreferenceFiltersValue>(EMPTY_PREFERENCES);
  const [guide, setGuide] = useState<DestinationGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  function saveTrip() {
    if (!guide) return;
    const existing = parseSavedTrips(localStorage.getItem(SAVED_TRIPS_KEY));
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(mergeSavedTrip(existing, guide)));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  async function copyItinerary() {
    if (!guide) return;
    await navigator.clipboard.writeText(formatItinerary(guide));
    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  }

  async function discover(target: string) {
    const trimmed = target.trim();
    if (!trimmed) return;

    setDestination(trimmed);
    setLoading(true);
    setError(null);
    setGuide(null);

    try {
      const res = await fetch("/api/destination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: trimmed, ...preferences }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setGuide(data);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (guide) {
    return (
      <DestinationGuideView
        guide={guide}
        onNewSearch={() => setGuide(null)}
        onSave={saveTrip}
        onCopy={copyItinerary}
        saveStatus={saveStatus}
        copyStatus={copyStatus}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-16 pt-14 text-center sm:pt-20">
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 gap-0.5 opacity-50">
          {PRESET_DESTINATIONS.map((d) => (
            <DestinationImage key={d.name} type="hero" query={d.imageQuery} label="" className="h-full rounded-none" />
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-background" />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-5">
          <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Powered by Gemini
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Discover the soul of every destination
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-white/90">
            Explore hidden gems, heritage, food, traditions, and local
            stories with Gemini-powered cultural guides.
          </p>

          <div className="mt-2 w-full rounded-3xl bg-card/95 p-5 text-left shadow-2xl backdrop-blur">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                discover(destination);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Try Jaipur, Kyoto, Bali..."
                aria-label="Destination"
                disabled={loading}
                className="h-11 flex-1 text-base"
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading || !destination.trim()}
                className="h-11 font-semibold shadow-md"
              >
                {loading ? "Discovering..." : "Discover"}
              </Button>
            </form>

            <div className="mt-4 border-t border-border pt-4">
              <PreferenceFilters value={preferences} onChange={setPreferences} disabled={loading} />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Gemini will build a culture-first guide from your preferences.
            </p>

            {error && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          {loading && (
            <div className="w-full">
              <LoadingGuide destination={destination} />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Popular destinations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick one to see its culture come alive.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PRESET_DESTINATIONS.map((d) => (
            <DestinationCard
              key={d.name}
              name={d.name}
              country={d.country}
              tag={d.tag}
              imageQuery={d.imageQuery}
              onSelect={() => discover(d.name)}
              disabled={loading}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
