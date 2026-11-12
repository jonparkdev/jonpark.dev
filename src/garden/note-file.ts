import { parse as parseYaml } from "yaml";
import { isObject, type Curriculum, type Topic } from "./curriculum";
import { isStage, STAGES, type Stage } from "./stage";

/** Richer formats a Note can declare. Validated, not rendered, in the MVP. */
export const UPGRADES = ["diagram", "interactive", "explainer"] as const;
export type Upgrade = (typeof UPGRADES)[number];

/** What one Note file says about itself, once its frontmatter is validated. */
export interface NoteFile {
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
}

/** A build problem with one Note, worded the same way everywhere. */
export function noteProblem(filename: string, problem: string): string {
  return `Note "${filename}": ${problem}`;
}

/** The page path of the Note with this slug. */
export function notePath(slug: string): string {
  return `/notes/${slug}`;
}

/** Kebab-case of a Note title: lowercase words joined by single hyphens. */
function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/**
 * Parses a Note file and validates its frontmatter against the Curriculum.
 * Reports every problem found (without the Note-naming prefix) and returns
 * undefined if there were any.
 */
export function readNote(
  filename: string,
  source: string,
  curriculum: Curriculum,
  report: (problem: string) => void,
): NoteFile | undefined {
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
  if (!isObject(frontmatter)) {
    report("frontmatter must be a set of fields");
    return undefined;
  }
  const fields = frontmatter;
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
  return {
    filename,
    title,
    slug: slugify(title),
    stage,
    topic,
    upgrades: upgradeList as Upgrade[],
    markdown: match ? source.slice(match[0].length) : source,
  };
}
