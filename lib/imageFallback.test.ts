import { describe, expect, it } from "vitest";
import { buildWikipediaSearchUrl, extractWikipediaThumbnail } from "./imageFallback";

describe("buildWikipediaSearchUrl", () => {
  it("encodes the query and targets the Wikipedia API", () => {
    const url = buildWikipediaSearchUrl("Jaipur Amber Fort");
    expect(url).toContain("en.wikipedia.org/w/api.php");
    expect(url).toContain("gsrsearch=Jaipur%20Amber%20Fort");
    expect(url).toContain("origin=*");
  });
});

describe("extractWikipediaThumbnail", () => {
  it("returns the thumbnail source when present", () => {
    const data = {
      query: {
        pages: {
          "123": { thumbnail: { source: "https://upload.wikimedia.org/example.jpg" } },
        },
      },
    };
    expect(extractWikipediaThumbnail(data)).toBe("https://upload.wikimedia.org/example.jpg");
  });

  it("returns null when there are no pages", () => {
    expect(extractWikipediaThumbnail({ batchcomplete: "" })).toBeNull();
  });

  it("returns null when the page has no thumbnail", () => {
    const data = { query: { pages: { "123": { title: "Some place" } } } };
    expect(extractWikipediaThumbnail(data)).toBeNull();
  });

  it("returns null for null or undefined input", () => {
    expect(extractWikipediaThumbnail(null)).toBeNull();
    expect(extractWikipediaThumbnail(undefined)).toBeNull();
  });
});
