"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  Compass,
  Copy,
  MapPin,
  Quote,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DestinationImage } from "@/components/destination-image";
import { PreferenceFilters, type PreferenceFiltersValue } from "@/components/preference-filters";
import { PRESET_DESTINATIONS } from "@/lib/destinations";
import { formatItinerary } from "@/lib/formatters";
import { mergeSavedTrip, parseSavedTrips, SAVED_TRIPS_KEY } from "@/lib/storage";
import type { DestinationGuide, GlanceType } from "@/lib/types";

const GLANCE_LABELS: Record<GlanceType, string> = {
  hero: "Highlight",
  heritage: "Heritage",
  food: "Food",
  festival: "Festival",
  craft: "Craft",
  hiddenGem: "Hidden gem",
  experience: "Experience",
};

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

  if (!guide) {
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
            <p className="max-w-lg text-lg text-white/90">
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
                <Button type="submit" size="lg" disabled={loading || !destination.trim()} className="h-11">
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
          <h2 className="text-xl font-semibold text-foreground">Popular destinations</h2>
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

  return (
    <div className="flex flex-1 flex-col items-center bg-background pb-16">
      <div className="w-full max-w-4xl px-6 pt-6">
        <button
          type="button"
          onClick={() => setGuide(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          New search
        </button>
      </div>

      <div className="w-full max-w-4xl px-6 pt-4">
        <DestinationImage
          type="hero"
          query={guide.heroImageQuery}
          label={`${guide.destinationName} cultural hero image`}
          className="aspect-[16/8] rounded-2xl sm:aspect-[21/9]"
        >
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6">
            <span className="mb-2 flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Compass className="size-3.5" aria-hidden="true" />
              Cultural Guide
            </span>
            <h1 className="text-3xl font-bold text-white drop-shadow sm:text-4xl">
              {guide.destinationName}
            </h1>
            <p className="flex items-center gap-1 text-white/90 drop-shadow">
              <MapPin className="size-4" aria-hidden="true" />
              {guide.country}
            </p>
          </div>
        </DestinationImage>
        <p className="mt-4 text-lg leading-relaxed text-foreground/90">{guide.culturalIntro}</p>
      </div>

      <div className="mt-8 w-full max-w-4xl px-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>Why this destination fits you</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">{guide.whyItFits}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Culture at a glance</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guide.cultureAtAGlance.map((card) => (
            <Card key={card.title} className="overflow-hidden py-0">
              <div className="relative">
                <DestinationImage type={card.type} query={card.imageQuery} label={card.imageQuery} className="rounded-none" />
                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
                  {GLANCE_LABELS[card.type]}
                </span>
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="text-base">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-foreground/80">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Hidden gems</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guide.hiddenGems.map((gem) => (
            <Card key={gem.name} className="overflow-hidden py-0">
              <div className="relative">
                <DestinationImage type="hiddenGem" query={gem.imageQuery} label={gem.imageQuery} className="rounded-none" />
                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
                  Hidden gem
                </span>
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="text-base">{gem.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-foreground/80">{gem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Immersive story</h2>
        <Card className="border-none bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm dark:from-amber-950/40 dark:to-orange-950/40">
          <CardContent className="pt-4">
            <Quote className="size-6 text-primary/40" aria-hidden="true" />
            <p className="mt-2 text-base leading-relaxed text-foreground/90 italic">
              {guide.immersiveStory}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Local experiences</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {guide.localExperiences.map((experience) => (
              <Card key={experience.title}>
                <CardHeader>
                  <CardTitle className="text-base">{experience.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{experience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Local etiquette</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-foreground/80">
                {guide.localEtiquette.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">1-day cultural itinerary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sunrise className="size-4" aria-hidden="true" />
                </span>
                Morning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{guide.itinerary.morning}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sun className="size-4" aria-hidden="true" />
                </span>
                Afternoon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{guide.itinerary.afternoon}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sunset className="size-4" aria-hidden="true" />
                </span>
                Evening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{guide.itinerary.evening}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={saveTrip} className="gap-1.5">
            {saveStatus === "saved" ? (
              <>
                <BookmarkCheck className="size-4" aria-hidden="true" />
                Trip saved
              </>
            ) : (
              <>
                <Bookmark className="size-4" aria-hidden="true" />
                Save trip
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={copyItinerary} className="gap-1.5">
            {copyStatus === "copied" ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden="true" />
                Copy itinerary
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
