export function buildWikipediaSearchUrl(query: string): string {
  return `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*`;
}

export function extractWikipediaThumbnail(data: unknown): string | null {
  const pages = (data as { query?: { pages?: Record<string, unknown> } } | null | undefined)?.query
    ?.pages;
  if (!pages) return null;

  const firstPage = Object.values(pages)[0] as { thumbnail?: { source?: string } } | undefined;
  return firstPage?.thumbnail?.source ?? null;
}
