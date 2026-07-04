"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DestinationImage, type GlanceType } from "@/components/destination-image";

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
const WEATHER_OPTIONS = ["Warm", "Cool", "Rainy"];
const BUDGET_OPTIONS = ["Budget", "Mid-range", "Splurge"];
const MOOD_OPTIONS = ["Chill", "Adventurous", "Spiritual", "Foodie"];

function PreferenceChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(selected ? "" : option)}
              aria-pressed={selected}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SAVED_TRIPS_KEY = "cultureCompass.savedTrips";

function formatItinerary(guide: DestinationGuide) {
  return [
    `${guide.destinationName}, ${guide.country} - 1-Day Cultural Itinerary`,
    "",
    `Morning: ${guide.itinerary.morning}`,
    `Afternoon: ${guide.itinerary.afternoon}`,
    `Evening: ${guide.itinerary.evening}`,
  ].join("\n");
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [weather, setWeather] = useState("");
  const [budget, setBudget] = useState("");
  const [mood, setMood] = useState("");
  const [guide, setGuide] = useState<DestinationGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  function saveTrip() {
    if (!guide) return;
    const existing = JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) ?? "[]");
    const updated = [
      ...existing.filter((trip: DestinationGuide) => trip.destinationName !== guide.destinationName),
      guide,
    ];
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updated));
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
        body: JSON.stringify({ destination: trimmed, weather, budget, mood }),
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

          <div className="flex flex-wrap justify-center gap-6 pt-2">
            <PreferenceChips label="Weather" options={WEATHER_OPTIONS} value={weather} onChange={setWeather} />
            <PreferenceChips label="Budget" options={BUDGET_OPTIONS} value={budget} onChange={setBudget} />
            <PreferenceChips label="Mood" options={MOOD_OPTIONS} value={mood} onChange={setMood} />
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
        <DestinationImage
          type="hero"
          query={guide.heroImageQuery}
          label={`${guide.destinationName} cultural hero image`}
          className="aspect-[21/9] rounded-xl"
        >
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6">
            <h1 className="text-3xl font-semibold text-white drop-shadow">
              {guide.destinationName}
            </h1>
            <p className="text-white/90 drop-shadow">{guide.country}</p>
          </div>
        </DestinationImage>
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
              <DestinationImage type={card.type} query={card.imageQuery} label={card.imageQuery} />
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
              <DestinationImage type="hiddenGem" query={gem.imageQuery} label={gem.imageQuery} />
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

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={saveTrip}>
            {saveStatus === "saved" ? "Trip saved" : "Save trip"}
          </Button>
          <Button type="button" variant="outline" onClick={copyItinerary}>
            {copyStatus === "copied" ? "Copied!" : "Copy itinerary"}
          </Button>
        </div>
      </div>
    </div>
  );
}
