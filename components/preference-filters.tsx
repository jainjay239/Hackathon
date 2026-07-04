"use client";

import { useState } from "react";
import {
  Accessibility,
  ChevronDown,
  Clock,
  CloudSun,
  Heart,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import {
  BUDGET_OPTIONS,
  COMFORT_NEED_OPTIONS,
  CULTURAL_INTEREST_OPTIONS,
  MOOD_OPTIONS,
  TRAVELER_TYPE_OPTIONS,
  TRIP_LENGTH_OPTIONS,
  WEATHER_OPTIONS,
} from "@/lib/preferences";
import { toggleArrayValue, toggleChipValue } from "@/lib/validation";

function ChipButton({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all disabled:opacity-50 ${
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function SingleSelectGroup({
  icon,
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <ChipButton
            key={option}
            label={option}
            selected={value === option}
            onClick={() => onChange(toggleChipValue(value, option))}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function MultiSelectGroup({
  icon,
  label,
  options,
  values,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <ChipButton
            key={option}
            label={option}
            selected={values.includes(option)}
            onClick={() => onChange(toggleArrayValue(values, option))}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export interface PreferenceFiltersValue {
  tripLength: string;
  travelerType: string;
  budget: string;
  weather: string;
  mood: string;
  culturalInterests: string[];
  comfortNeeds: string[];
}

export function PreferenceFilters({
  value,
  onChange,
  disabled,
}: {
  value: PreferenceFiltersValue;
  onChange: (value: PreferenceFiltersValue) => void;
  disabled: boolean;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Shape your cultural journey
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SingleSelectGroup
          icon={<Clock className="size-3.5" aria-hidden="true" />}
          label="Trip length"
          options={TRIP_LENGTH_OPTIONS}
          value={value.tripLength}
          onChange={(tripLength) => onChange({ ...value, tripLength })}
          disabled={disabled}
        />
        <SingleSelectGroup
          icon={<Users className="size-3.5" aria-hidden="true" />}
          label="Travelers"
          options={TRAVELER_TYPE_OPTIONS}
          value={value.travelerType}
          onChange={(travelerType) => onChange({ ...value, travelerType })}
          disabled={disabled}
        />
        <SingleSelectGroup
          icon={<Wallet className="size-3.5" aria-hidden="true" />}
          label="Budget"
          options={BUDGET_OPTIONS}
          value={value.budget}
          onChange={(budget) => onChange({ ...value, budget })}
          disabled={disabled}
        />
        <SingleSelectGroup
          icon={<CloudSun className="size-3.5" aria-hidden="true" />}
          label="Weather"
          options={WEATHER_OPTIONS}
          value={value.weather}
          onChange={(weather) => onChange({ ...value, weather })}
          disabled={disabled}
        />
        <SingleSelectGroup
          icon={<Heart className="size-3.5" aria-hidden="true" />}
          label="Travel mood"
          options={MOOD_OPTIONS}
          value={value.mood}
          onChange={(mood) => onChange({ ...value, mood })}
          disabled={disabled}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowMore((prev) => !prev)}
        aria-expanded={showMore}
        className="flex w-fit items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        <ChevronDown
          className={`size-3.5 transition-transform ${showMore ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
        More cultural preferences
      </button>

      {showMore && (
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">Choose what matters to you</p>
          <MultiSelectGroup
            icon={<Sparkles className="size-3.5" aria-hidden="true" />}
            label="Cultural interests"
            options={CULTURAL_INTEREST_OPTIONS}
            values={value.culturalInterests}
            onChange={(culturalInterests) => onChange({ ...value, culturalInterests })}
            disabled={disabled}
          />
          <MultiSelectGroup
            icon={<Accessibility className="size-3.5" aria-hidden="true" />}
            label="Comfort & accessibility"
            options={COMFORT_NEED_OPTIONS}
            values={value.comfortNeeds}
            onChange={(comfortNeeds) => onChange({ ...value, comfortNeeds })}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
