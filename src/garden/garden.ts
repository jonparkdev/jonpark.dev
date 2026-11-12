import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { loadCurriculum, type Curriculum, type Topic } from "./curriculum";
import { gardenInputs, type GardenInputs } from "./inputs";
import { renderMarkdown } from "./markdown";
import { progressMap, type PartProgress } from "./progress";
import { isStage, STAGES, type Stage } from "./stage";
import { recentlyTended, tendedDate } from "./tended";

/** Richer formats a Note can declare. Validated, not rendered, in the MVP. */
export const UPGRADES = ["diagram", "interactive", "explainer"] as const;
export type Upgrade = (typeof UPGRADES)[number];

/** One idea in the garden, ready to render. */
export interface Note {
  /** Filename in the notes folder, e.g. "Consistent hashing.md". */
  filename: string;
  /** Filename without `.md`. Notes have no separate title field. */
  title: string;
  /** Kebab-case of the title; the page lives at `/notes/<slug>`. */
  slug: string;
  stage: Stage;
  topic: Topic;
  upgrades: Upgrade[];
  /** Markdown body, frontmatter removed. */
  markdown: string;
  /** Rendered body HTML. */
  html: string;
  /** When the Note was last Tended: its file's last git commit, or now if uncommitted. */
  tended: Date;
}

/** Everything pages render from: the Curriculum and every Note, validated. */
export interface Garden {
  curriculum: Curriculum;
  /** All Notes, ordered by title. */
  notes: Note[];
  /** The Note with this slug, if any. */
  note(slug: string): Note | undefined;
  /** The Progress map: every Part and Topic in Curriculum order, each Topic with its Notes and Stage. */
  progressMap: PartProgress[];
  /** The five most recently Tended Notes, newest first (ties by title). */
  recentlyTended: Note[];
}

/** Thrown when Notes break the garden's rules. Lists every problem, each naming its Note. */
export class GardenError extends Error {
  constructor(readonly problems: string[]) {
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

/** Kebab-case of a Note title: lowercase words joined by single hyphens. */
export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function buildGarden(inputs: GardenInputs): Garden {
  const curriculum = loadCurriculum(inputs.curriculumPath);
  const problems: string[] = [];

  const filenames = readdirSync(inputs.notesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  const notes: Note[] = [];
  const now = new Date();
  for (const filename of filenames) {
    const source = readFileSync(join(inputs.notesDir, filename), "utf8");
    const note = readNote(filename, source, curriculum, (problem) =>
      problems.push(`Note "${filename}": ${problem}`),
    );
    if (note) notes.push({ ...note, tended: tendedDate(inputs.notesDir, filename, now) });
  }

  const bySlug = new Map<string, Note[]>();
  for (const note of notes) bySlug.set(note.slug, [...(bySlug.get(note.slug) ?? []), note]);
  for (const [slug, clashing] of bySlug) {
    if (clashing.length > 1) {
      const names = clashing.map((note) => `"${note.filename}"`).join(" and ");
      problems.push(`Notes ${names} have the same slug "${slug}"; rename one of them`);
    }
  }

  if (problems.length > 0) throw new GardenError(problems);

  notes.sort((a, b) => a.title.localeCompare(b.title));
  return {
    curriculum,
    notes,
    note: (slug) => bySlug.get(slug)?.[0],
    progressMap: progressMap(curriculum, notes),
    recentlyTended: recentlyTended(notes),
  };
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

function readNote(
  filename: string,
  source: string,
  curriculum: Curriculum,
  report: (problem: string) => void,
): Omit<Note, "tended"> | undefined {
  const match = FRONTMATTER.exec(source);
  let frontmatter: unknown = {};
  if (match) {
    try {
      frontmatter = parseYaml(match[1]) ?? {};
    } catch (error) {
      report(`frontmatter is not valid YAML: ${(error as Error).message}`);
      return undefined;
    }
  }
  if (typeof frontmatter !== "object" || frontmatter === null || Array.isArray(frontmatter)) {
    report("frontmatter must be a set of fields");
    return undefined;
  }
  const fields = frontmatter as Record<string, unknown>;
  let valid = true;
  const fail = (problem: string) => {
    valid = false;
    report(problem);
  };

  for (const field of Object.keys(fields)) {
    if (!["stage", "topic", "upgrades"].includes(field)) {
      fail(`unknown field "${field}"; only stage, topic and upgrades are allowed`);
    }
  }

  const { stage, topic: topicKey } = fields;
  // An empty `upgrades:` property (as Obsidian writes it) means none.
  const upgrades = fields.upgrades ?? [];
  if (stage === undefined || stage === null) fail(`stage is missing; use one of ${STAGES.join(", ")}`);
  else if (!isStage(stage)) fail(`stage "${String(stage)}" is not one of ${STAGES.join(", ")}`);

  let topic: Topic | undefined;
  if (topicKey === undefined || topicKey === null) fail("topic is missing; use a Topic key from the Curriculum");
  else {
    topic = curriculum.topic(String(topicKey));
    if (!topic) fail(`topic "${String(topicKey)}" is not a Topic key in the Curriculum`);
  }

  const upgradeList: unknown[] = Array.isArray(upgrades) ? upgrades : [];
  if (!Array.isArray(upgrades)) fail(`upgrades must be a list of ${UPGRADES.join(", ")}`);
  for (const upgrade of upgradeList) {
    if (!(UPGRADES as readonly unknown[]).includes(upgrade)) {
      fail(`upgrades value "${String(upgrade)}" is not one of ${UPGRADES.join(", ")}`);
    }
  }

  if (!valid || !isStage(stage) || !topic) return undefined;

  const title = filename.replace(/\.md$/, "");
  const markdown = match ? source.slice(match[0].length) : source;
  return {
    filename,
    title,
    slug: slugify(title),
    stage,
    topic,
    upgrades: upgradeList as Upgrade[],
    markdown,
    html: renderMarkdown(markdown),
  };
}
