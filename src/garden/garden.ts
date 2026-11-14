import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadCurriculum, type Part } from "./curriculum";
import { gardenInputs, type GardenInputs } from "./inputs";
import { renderMarkdown } from "./markdown";
import { noteProblem, notePath, readNote, type NoteFile } from "./note-file";
import { progressMap, type PartProgress } from "./progress";
import { recentlyTended, tendedDate } from "./tended";

/** One idea in the garden, ready to render. */
export interface Note extends NoteFile {
  /** Rendered body HTML, wikilinks resolved and Diagrams embedded. */
  html: string;
  /**
   * The written Notes this Note's body wikilinks to, in first-mention order,
   * each once. Links to unwritten Notes are not included.
   */
  linksTo: Note[];
  /** The other Notes whose bodies wikilink to this one, ordered by title, each once. */
  linkedFrom: Note[];
  /** The Curriculum Part the Note's Topic belongs to. */
  part: Part;
  /** True if the Note's Topic is a Tangent. */
  isTangent: boolean;
  /** The Tangent Notes this Note's body links to, in footnote order (first mention first). */
  tangents: Note[];
  /** When the Note was last Tended: its file's last git commit, or now if uncommitted. */
  tended: Date;
}

/** Everything pages render from: every Note, validated, and the views built on them. */
export interface Garden {
  /** All Notes, ordered by title. */
  notes: Note[];
  /** The Progress map: every Part and Topic in Curriculum order, each Topic with its Notes and Stage. */
  progressMap: PartProgress[];
  /** The five most recently Tended Notes, newest first (ties by title). */
  recentlyTended: Note[];
}

/** Thrown when Notes break the garden's rules. Lists every problem, each naming its Note. */
export class GardenError extends Error {
  constructor(problems: string[]) {
    super(`The garden has ${problems.length} problem(s):\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "GardenError";
  }
}

const cache = new Map<string, Garden>();

/**
 * Builds the Garden from the build's inputs (see `inputs.ts`). Pages call this
 * with no arguments. Cached per input set, since every page asks for it.
 * Throws a GardenError if any Note is invalid.
 */
export function loadGarden(inputs: GardenInputs = gardenInputs()): Garden {
  const cacheKey = JSON.stringify(inputs);
  let garden = cache.get(cacheKey);
  if (!garden) {
    garden = buildGarden(inputs);
    cache.set(cacheKey, garden);
  }
  return garden;
}

function buildGarden(inputs: GardenInputs): Garden {
  const curriculum = loadCurriculum(inputs.curriculumPath);
  const problems: string[] = [];

  const filenames = readdirSync(inputs.notesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  const partOf = new Map(curriculum.parts.flatMap((part) => part.topics.map((topic) => [topic.key, part] as const)));
  const notes: Note[] = [];
  const now = new Date();
  for (const filename of filenames) {
    const source = readFileSync(join(inputs.notesDir, filename), "utf8");
    const file = readNote(filename, source, curriculum, (problem) => problems.push(noteProblem(filename, problem)));
    if (file) {
      const part = partOf.get(file.topic.key)!;
      notes.push({
        ...file,
        part,
        isTangent: part.isTangents,
        html: "",
        linksTo: [],
        linkedFrom: [],
        tangents: [],
        tended: tendedDate(inputs.notesDir, filename, now),
      });
    }
  }

  for (const [slug, clashing] of Map.groupBy(notes, (note) => note.slug)) {
    if (clashing.length > 1) {
      const names = clashing.map((note) => `"${note.filename}"`).join(" and ");
      problems.push(`Notes ${names} have the same slug "${slug}"; rename one of them`);
    }
  }

  notes.sort((a, b) => a.title.localeCompare(b.title));
  renderNotes(notes, inputs.assetsDir, problems);
  linkBacklinks(notes);

  if (problems.length > 0) throw new GardenError(problems);

  return {
    notes,
    progressMap: progressMap(curriculum, notes),
    recentlyTended: recentlyTended(notes),
  };
}

/** Second pass, once every Note is known: renders bodies and records resolved wikilinks. */
function renderNotes(notes: Note[], assetsDir: string, problems: string[]): void {
  // Obsidian resolves wikilinks by filename, ignoring case.
  const byTitle = new Map(notes.map((note) => [note.title.toLowerCase(), note]));
  for (const note of notes) {
    const linked = new Set<Note>();
    const tangents: Note[] = [];
    note.html = renderMarkdown(note.markdown, {
      resolveNote(target) {
        const found = byTitle.get(target.toLowerCase());
        if (!found) return undefined;
        linked.add(found);
        const href = notePath(found.slug);
        // A Tangent gets a footnote, but not when this Note is itself in Tangents or links to itself.
        if (!found.isTangent || note.isTangent || found === note) return { href };
        const firstMention = !tangents.includes(found);
        if (firstMention) tangents.push(found);
        return { href, tangentFootnote: tangents.indexOf(found) + 1, firstMention };
      },
      embedDiagram(name) {
        const path = join(assetsDir, name);
        if (!existsSync(path)) {
          problems.push(noteProblem(note.filename, `Diagram "${name}" is not in the assets folder ${assetsDir}`));
          return "";
        }
        return inlineSvg(readFileSync(path, "utf8"));
      },
    });
    note.linksTo = [...linked];
    note.tangents = tangents;
  }
}

/** Inverts `linksTo` into `linkedFrom`. `notes` is sorted by title, so each list is too. */
function linkBacklinks(notes: Note[]): void {
  for (const source of notes) {
    for (const target of source.linksTo) {
      if (target !== source) target.linkedFrom.push(source);
    }
  }
}

/** SVG file contents ready to drop into HTML: the XML prolog and doctype removed. */
function inlineSvg(svg: string): string {
  return svg
    .replace(/^﻿/, "")
    .replace(/<\?xml[\s\S]*?\?>/, "")
    .replace(/<!DOCTYPE[^>]*>/i, "")
    .trim();
}
