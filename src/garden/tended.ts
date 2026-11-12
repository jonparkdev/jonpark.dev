import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { Note } from "./garden";

/** How many Notes the home page lists as Recently tended. */
const RECENTLY_TENDED_COUNT = 5;

/**
 * When a Note was Tended: the author date of the last git commit touching its
 * file. The author date, unlike the committer date, survives rebases and
 * squash-merges. A Note with no commit yet (only in local development) counts
 * as tended `now`, as does any Note outside a git repo.
 */
export function tendedDate(notesDir: string, filename: string, now: Date): Date {
  const result = spawnSync("git", ["log", "-1", "--format=%aI", "--", join(notesDir, filename)], {
    cwd: notesDir,
    encoding: "utf8",
  });
  const committed = result.status === 0 ? result.stdout.trim() : "";
  return committed ? new Date(committed) : now;
}

/** The most recently Tended Notes, newest first. Ties keep their given order. */
export function recentlyTended(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.tended.getTime() - a.tended.getTime()).slice(0, RECENTLY_TENDED_COUNT);
}

/** A Tended date as YYYY-MM-DD (UTC). */
export function tendedDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
