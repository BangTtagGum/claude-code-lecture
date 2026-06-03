import { describe, it, expect } from "vitest";
import { fuzzyScore, searchNotes, type Note } from "./search.js";

describe("fuzzyScore", () => {
  it("returns null when characters are not all present in order", () => {
    expect(fuzzyScore("abc", "acb")).toBeNull();
    expect(fuzzyScore("xyz", "hello")).toBeNull();
  });

  it("matches characters appearing in order but not contiguous", () => {
    // "gtd" matches "getting-things-done"
    expect(fuzzyScore("gtd", "getting-things-done")).not.toBeNull();
  });

  it("is case-insensitive", () => {
    expect(fuzzyScore("ABC", "a-b-c")).not.toBeNull();
  });

  it("scores a contiguous match higher than a scattered one", () => {
    const contiguous = fuzzyScore("note", "note-search")!;
    const scattered = fuzzyScore("note", "n-o-t-e-x")!;
    expect(contiguous).toBeGreaterThan(scattered);
  });

  it("treats an empty query as a match with score 0", () => {
    expect(fuzzyScore("", "anything")).toBe(0);
  });
});

describe("searchNotes", () => {
  const notes: Note[] = [
    { path: "a.md", title: "Getting Things Done", body: "weekly review notes" },
    { path: "b.md", title: "Grocery List", body: "milk and eggs" },
    { path: "c.md", title: "Daily Standup", body: "what did i do today" },
  ];

  it("returns only notes that match the query", () => {
    const results = searchNotes(notes, "grocery");
    expect(results.map((r) => r.note.path)).toEqual(["b.md"]);
  });

  it("matches against title and body", () => {
    const results = searchNotes(notes, "weekly");
    expect(results.map((r) => r.note.path)).toEqual(["a.md"]);
  });

  it("sorts results by descending score", () => {
    const results = searchNotes(notes, "do");
    // both "Getting Things Done" and "what did i do today" contain "do"
    expect(results.length).toBeGreaterThan(1);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("returns an empty array when nothing matches", () => {
    expect(searchNotes(notes, "zzzzz")).toEqual([]);
  });
});
