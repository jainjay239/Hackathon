"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GlanceType = "heritage" | "food" | "festival" | "craft" | "hiddenGem" | "experience";

interface GlanceCard {
  type: GlanceType;
  title: string;
  description: string;
  imageQuery: string;
}

interface HiddenGem {
  name: string;
  description: string;
  imageQuery: string;
}

interface LocalExperience {
  title: string;
  description: string;
}

interface DestinationGuide {
  destinationName: string;
  country: string;
  culturalIntro: string;
  heroImageQuery: string;
  whyItFits: string;
  cultureAtAGlance: GlanceCard[];
  hiddenGems: HiddenGem[];
  immersiveStory: string;
  localExperiences: LocalExperience[];
  localEtiquette: string[];
  itinerary: { morning: string; afternoon: string; evening: string };
}

const PRESET_DESTINATIONS = ["Jaipur", "Varanasi", "Kyoto", "Bali", "Istanbul", "Oaxaca"];

const CATEGORY_STYLES: Record<GlanceType, { emoji: string; gradient: string }> = {
  heritage: { emoji: "🏛️", gradient: "from-amber-200 to-orange-300 dark:from-amber-900 dark:to-orange-950" },
  food: { emoji: "🍲", gradient: "from-rose-200 to-red-300 dark:from-rose-900 dark:to-red-950" },
  festival: { emoji: "🎉", gradient: "from-fuchsia-200 to-purple-300 dark:from-fuchsia-900 dark:to-purple-950" },
  craft: { emoji: "🧵", gradient: "from-teal-200 to-emerald-300 dark:from-teal-900 dark:to-emerald-950" },
  hiddenGem: { emoji: "💎", gradient: "from-sky-200 to-blue-300 dark:from-sky-900 dark:to-blue-950" },
  experience: { emoji: "🌟", gradient: "from-yellow-200 to-amber-300 dark:from-yellow-900 dark:to-amber-950" },
};

function ImagePlaceholder({ type, label }: { type: GlanceType; label: string }) {
  const style = CATEGORY_STYLES[type];
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex aspect-video w-full items-center justify-center rounded-lg bg-gradient-to-br text-4xl ${style.gradient}`}
    >
      <span aria-hidden="true">{style.emoji}</span>
    </div>
  );
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [guide, setGuide] = useState<DestinationGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ destination: trimmed }),
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
      <div className="flex flex-1 flex-col items-center bg-background px-6 py-16">
        <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Culture Compass
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Discover a destination through its hidden gems, heritage, food,
            and stories, guided by Gemini.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              discover(destination);
            }}
            className="flex w-full max-w-md gap-2"
          >
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Try Jaipur, Kyoto, Bali..."
              aria-label="Destination"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !destination.trim()}>
              {loading ? "Discovering..." : "Discover"}
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {PRESET_DESTINATIONS.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => discover(city)}
                disabled={loading}
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                {city}
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-sm text-muted-foreground">
              Consulting a local guide for {destination}...
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-background pb-16">
      <div className="w-full max-w-4xl px-6 pt-6">
        <button
          type="button"
          onClick={() => setGuide(null)}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← New search
        </button>
      </div>

      <div className="w-full max-w-4xl px-6 pt-4">
        <div className="relative flex aspect-[21/9] w-full flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br from-indigo-300 to-violet-400 p-6 dark:from-indigo-950 dark:to-violet-950">
          <h1 className="text-3xl font-semibold text-white drop-shadow">
            {guide.destinationName}
          </h1>
          <p className="text-white/90 drop-shadow">{guide.country}</p>
        </div>
        <p className="mt-4 text-lg text-foreground/90">{guide.culturalIntro}</p>
      </div>

      <div className="mt-8 w-full max-w-4xl px-6">
        <Card>
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
            <Card key={card.title}>
              <ImagePlaceholder type={card.type} label={card.imageQuery} />
              <CardHeader>
                <CardTitle className="text-base">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
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
            <Card key={gem.name}>
              <ImagePlaceholder type="hiddenGem" label={gem.imageQuery} />
              <CardHeader>
                <CardTitle className="text-base">{gem.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">{gem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Immersive story</h2>
        <Card>
          <CardContent className="pt-4">
            <p className="text-base leading-relaxed text-foreground/90 italic">
              {guide.immersiveStory}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Local experiences</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Local etiquette</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm text-foreground/80">
              {guide.localEtiquette.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 w-full max-w-4xl px-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">1-day cultural itinerary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Morning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{guide.itinerary.morning}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Afternoon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{guide.itinerary.afternoon}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evening</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{guide.itinerary.evening}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
