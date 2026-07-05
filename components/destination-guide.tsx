"use client";

import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  Compass,
  Copy,
  ExternalLink,
  MapPin,
  Quote,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DestinationImage } from "@/components/destination-image";
import { DestinationSidebar, type SidebarItem } from "@/components/destination-sidebar";
import { findTourismBoard } from "@/lib/destinations";
import { deriveDestinationSections } from "@/lib/sections";
import type { DestinationGuide, GlanceCard, GlanceType, LocalExperience } from "@/lib/types";

const GLANCE_LABELS: Record<GlanceType, string> = {
  hero: "Highlight",
  attraction: "Attraction",
  heritage: "Heritage",
  food: "Food",
  festival: "Festival",
  craft: "Craft",
  hiddenGem: "Hidden gem",
  experience: "Experience",
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "overview", label: "Overview" },
  { id: "why-it-fits", label: "Why it fits you" },
  { id: "sightseeing", label: "Sightseeing" },
  { id: "food", label: "Food" },
  { id: "locals", label: "Locals" },
  { id: "traditions", label: "Traditions" },
  { id: "heritage", label: "Heritage" },
  { id: "hidden-gems", label: "Hidden gems" },
  { id: "festivals", label: "Festivals" },
  { id: "experiences", label: "Experiences" },
  { id: "etiquette", label: "Etiquette" },
  { id: "itinerary", label: "Itinerary" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold tracking-tight text-foreground">{children}</h2>;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">{children}</p>;
}

function GlanceCardGrid({ cards }: { cards: GlanceCard[] }) {
  if (cards.length === 0) {
    return <EmptyState>Nothing specific surfaced here for this destination this time.</EmptyState>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
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
            <p className="text-sm leading-relaxed text-foreground/80">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExperienceList({ experiences }: { experiences: LocalExperience[] }) {
  if (experiences.length === 0) {
    return <EmptyState>No specific highlights surfaced here for this destination this time.</EmptyState>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {experiences.map((experience) => (
        <Card key={experience.title}>
          <CardHeader>
            <CardTitle className="text-base">{experience.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/80">{experience.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DestinationGuideView({
  guide,
  onNewSearch,
  onSave,
  onCopy,
  saveStatus,
  copyStatus,
}: {
  guide: DestinationGuide;
  onNewSearch: () => void;
  onSave: () => void;
  onCopy: () => void;
  saveStatus: "idle" | "saved";
  copyStatus: "idle" | "copied";
}) {
  const sections = deriveDestinationSections(guide);
  const tourismBoard = findTourismBoard(guide.destinationName);

  return (
    <div className="flex w-full flex-1 flex-col items-center bg-background px-6 pb-20 pt-6">
      <div className="w-full max-w-6xl">
        <button
          type="button"
          onClick={onNewSearch}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          New search
        </button>

        <div className="mt-5 flex flex-col gap-10 lg:flex-row lg:gap-10">
          <DestinationSidebar title={`Explore ${guide.destinationName}`} items={SIDEBAR_ITEMS} />

          <div className="flex min-w-0 flex-1 flex-col gap-16">
            <section id="overview" className="scroll-mt-20">
              <DestinationImage
                type="hero"
                query={guide.heroImageQuery}
                label={`${guide.destinationName} cultural hero image`}
                className="aspect-[16/9] rounded-2xl sm:aspect-[21/8]"
              >
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6">
                  <span className="mb-2 flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    <Compass className="size-3.5" aria-hidden="true" />
                    Cultural Guide
                  </span>
                  <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl">
                    {guide.destinationName}
                  </h1>
                  <p className="flex items-center gap-1 text-white/90 drop-shadow">
                    <MapPin className="size-4" aria-hidden="true" />
                    {guide.country}
                  </p>
                </div>
              </DestinationImage>
              <p className="mt-5 text-lg leading-relaxed text-foreground/90">{guide.culturalIntro}</p>
              {tourismBoard && (
                <a
                  href={tourismBoard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  {tourismBoard.label}
                </a>
              )}
              <Card className="mt-5 border-none bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm dark:from-amber-950/40 dark:to-orange-950/40">
                <CardContent className="pt-4">
                  <Quote className="size-6 text-primary/40" aria-hidden="true" />
                  <p className="mt-2 text-base leading-relaxed text-foreground/90 italic">{guide.immersiveStory}</p>
                </CardContent>
              </Card>
            </section>

            <section id="why-it-fits" className="scroll-mt-20">
              <SectionHeading>Why this destination fits you</SectionHeading>
              <Card className="mt-4 border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed text-foreground/80">{guide.whyItFits}</p>
                </CardContent>
              </Card>
            </section>

            <section id="sightseeing" className="scroll-mt-20">
              <SectionHeading>Sightseeing</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">Attractions and cultural landmarks worth your time.</p>
              <div className="mt-4">
                <GlanceCardGrid cards={sections.sightseeing} />
              </div>
            </section>

            <section id="food" className="scroll-mt-20">
              <SectionHeading>Food</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">Local dishes, markets, and food rituals.</p>
              <div className="mt-4 flex flex-col gap-4">
                <GlanceCardGrid cards={sections.foodGlance} />
                <ExperienceList experiences={sections.foodExperiences} />
              </div>
            </section>

            <section id="locals" className="scroll-mt-20">
              <SectionHeading>Locals</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">
                Everyday life, neighborhoods, and local routines.
              </p>
              <div className="mt-4">
                <ExperienceList experiences={sections.localHighlights} />
              </div>
            </section>

            <section id="traditions" className="scroll-mt-20">
              <SectionHeading>Traditions</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">Rituals, crafts, and cultural customs.</p>
              <div className="mt-4">
                <GlanceCardGrid cards={sections.traditions} />
              </div>
            </section>

            <section id="heritage" className="scroll-mt-20">
              <SectionHeading>Heritage</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">Architecture, history, and cultural meaning.</p>
              <div className="mt-4">
                <GlanceCardGrid cards={sections.heritage} />
              </div>
            </section>

            <section id="hidden-gems" className="scroll-mt-20">
              <SectionHeading>Hidden gems</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">Lesser-known spots most visitors miss.</p>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                      <p className="text-sm leading-relaxed text-foreground/80">{gem.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="festivals" className="scroll-mt-20">
              <SectionHeading>Festivals</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">Seasonal cultural moments and celebrations.</p>
              <div className="mt-4">
                <GlanceCardGrid cards={sections.festivals} />
              </div>
            </section>

            <section id="experiences" className="scroll-mt-20">
              <SectionHeading>Experiences</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">
                Workshops, walks, ceremonies, and hands-on moments.
              </p>
              <div className="mt-4">
                <ExperienceList experiences={sections.experiences} />
              </div>
            </section>

            <section id="etiquette" className="scroll-mt-20">
              <SectionHeading>Etiquette</SectionHeading>
              <p className="mt-1 text-sm text-muted-foreground">Do&rsquo;s, don&rsquo;ts, and visitor sensitivity tips.</p>
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {guide.localEtiquette.map((tip) => (
                      <li key={tip} className="flex gap-2 leading-relaxed">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="itinerary" className="scroll-mt-20">
              <SectionHeading>
                {guide.itinerary.length > 1
                  ? `${guide.itinerary.length}-day cultural itinerary`
                  : "1-day cultural itinerary"}
              </SectionHeading>
              <div className="mt-4 flex flex-col gap-8">
                {guide.itinerary.map((day) => (
                  <div key={day.dayLabel}>
                    {guide.itinerary.length > 1 && (
                      <h3 className="mb-3 text-base font-semibold text-foreground">{day.dayLabel}</h3>
                    )}
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
                          <p className="text-sm leading-relaxed text-foreground/80">{day.morning}</p>
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
                          <p className="text-sm leading-relaxed text-foreground/80">{day.afternoon}</p>
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
                          <p className="text-sm leading-relaxed text-foreground/80">{day.evening}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={onSave} className="gap-1.5 font-semibold shadow-sm">
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
                <Button type="button" variant="outline" onClick={onCopy} className="gap-1.5 font-semibold">
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
