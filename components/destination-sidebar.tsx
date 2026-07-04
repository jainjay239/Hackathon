"use client";

import { useEffect, useState } from "react";

export interface SidebarItem {
  id: string;
  label: string;
}

function useScrollSpy(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function DestinationSidebar({ title, items }: { title: string; items: SidebarItem[] }) {
  const ids = items.map((item) => item.id);
  const activeId = useScrollSpy(ids);

  return (
    <>
      <nav
        aria-label={title}
        className="sticky top-6 hidden h-fit w-56 shrink-0 flex-col gap-1 lg:flex"
      >
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            aria-current={activeId === item.id ? "true" : undefined}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              activeId === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <nav
        aria-label={title}
        className="sticky top-0 z-20 flex gap-1.5 overflow-x-auto border-b border-border bg-background/95 py-3 backdrop-blur lg:hidden"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            aria-current={activeId === item.id ? "true" : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeId === item.id
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
