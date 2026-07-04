"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Gem {
  name: string;
  oneLiner: string;
  category: string;
  emoji: string;
}

const PRESET_DESTINATIONS = ["Jaipur", "Kyoto", "Oaxaca", "Lisbon"];

export default function Home() {
  const [destination, setDestination] = useState("");
  const [gems, setGems] = useState<Gem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function discover(target: string) {
    const trimmed = target.trim();
    if (!trimmed) return;

    setDestination(trimmed);
    setLoading(true);
    setError(null);
    setGems(null);

    try {
      const res = await fetch("/api/gems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setGems(data.gems);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-background px-6 py-16">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Culture Compass
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Enter a destination and discover hidden gems and the cultural
          stories behind them, powered by Gemini.
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
            placeholder="Try Jaipur, Kyoto, Oaxaca..."
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
      </div>

      <div className="mt-12 w-full max-w-4xl">
        {error && (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-center text-sm text-muted-foreground">
            Asking Gemini for hidden gems in {destination}...
          </p>
        )}

        {gems && gems.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gems.map((gem) => (
              <Card key={gem.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span aria-hidden="true">{gem.emoji}</span>
                    {gem.name}
                  </CardTitle>
                  <CardDescription>{gem.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{gem.oneLiner}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
