export interface Note {
  path: string;
  title: string;
  body: string;
}

export interface SearchResult {
  note: Note;
  score: number;
}

/**
 * Fuzzy-match `query` against `text`.
 *
 * Returns a score (higher = better) when every character of `query` appears in
 * `text` in order, or `null` when it does not match. Contiguous runs of matched
 * characters are rewarded, so a tight match scores higher than a scattered one.
 * An empty query trivially matches with score 0.
 */
export function fuzzyScore(query: string, text: string): number | null {
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  if (q.length === 0) return 0;

  let score = 0;
  let ti = 0;
  let runLength = 0;

  for (const ch of q) {
    let found = -1;
    for (let i = ti; i < t.length; i++) {
      if (t[i] === ch) {
        found = i;
        break;
      }
    }
    if (found === -1) return null;

    // Reward characters that continue an unbroken run (contiguous match).
    if (found === ti) {
      runLength += 1;
      score += 1 + runLength;
    } else {
      runLength = 1;
      score += 1;
    }
    ti = found + 1;
  }

  return score;
}

/**
 * Search a list of notes for `query`, matching against title and body.
 * Returns matching notes with their best score, sorted by descending score.
 */
export function searchNotes(notes: Note[], query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const note of notes) {
    const titleScore = fuzzyScore(query, note.title);
    const bodyScore = fuzzyScore(query, note.body);

    const best = bestScore(titleScore, bodyScore);
    if (best !== null) {
      results.push({ note, score: best });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

function bestScore(a: number | null, b: number | null): number | null {
  if (a === null) return b;
  if (b === null) return a;
  return Math.max(a, b);
}
