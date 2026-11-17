import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadCourses, type Course } from "./course";
import { gardenInputs, type GardenInputs } from "./inputs";
import { escapeHtml, renderMarkdown, type Footnote, type Heading } from "./markdown";
import { noteProblem, notePath, readNote, type NoteFile } from "./note-file";
import { stageBadgeHtml } from "./stage";
import { byTended, tendedDate } from "./tended";

/** One idea in the garden, ready to render. */
export interface Note extends NoteFile {
  /** Rendered body HTML, wikilinks resolved and Diagrams embedded. */
  html: string;
  /** The body's numbered sections and subsections, in order, for its Contents. */
  headings: Heading[];
  /** The author's own footnotes, numbered in order of first reference. */
  footnotes: Footnote[];
  /**
   * The written Notes this Note's body wikilinks to, in first-mention order,
   * each once. Links to unwritten Notes are not included.
   */
  linksTo: Note[];
  /** The other Notes whose bodies wikilink to this one, ordered by title, each once. */
  linkedFrom: Note[];
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
  /** Every Course, ordered by title. */
  courses: Course[];
  /** Every Note, most recently Tended first (ties by title). */
  byTended: Note[];
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
  const courses = loadCourses(inputs.coursesDir);
  const problems: string[] = [];

  const filenames = readdirSync(inputs.notesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  const notes: Note[] = [];
  const now = new Date();
  for (const filename of filenames) {
    const source = readFileSync(join(inputs.notesDir, filename), "utf8");
    const file = readNote(filename, source, courses, (problem) => problems.push(noteProblem(filename, problem)));
    if (file) {
      notes.push({
        ...file,
        isTangent: file.placement?.part.isTangents ?? false,
        html: "",
        headings: [],
        footnotes: [],
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
    courses,
    byTended: byTended(notes),
  };
}

/** Second pass, once every Note is known: renders bodies and records resolved wikilinks. */
function renderNotes(notes: Note[], assetsDir: string, problems: string[]): void {
  // Obsidian resolves wikilinks by filename, ignoring case.
  const byTitle = new Map(notes.map((note) => [note.title.toLowerCase(), note]));
  for (const note of notes) {
    const linked = new Set<Note>();
    const tangents: Note[] = [];
    const rendered = renderMarkdown(note.markdown, {
      resolveNote(target) {
        const found = byTitle.get(target.toLowerCase());
        if (!found) return undefined;
        linked.add(found);
        const href = notePath(found.slug);
        // A Tangent gets a footnote, but not when this Note is itself in Tangents or links to itself.
        if (!found.isTangent || note.isTangent || found === note) return { href };
        const firstMention = !tangents.includes(found);
        if (firstMention) tangents.push(found);
        const tangentNote = firstMention ? `Tangent: <a href="${escapeHtml(href)}">${escapeHtml(found.title)}</a> ${stageBadgeHtml(found.stage)}` : undefined;
        return { href, tangentFootnote: tangents.indexOf(found) + 1, firstMention, tangentNote };
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
    note.html = rendered.html;
    note.headings = rendered.headings;
    note.footnotes = rendered.footnotes;
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
