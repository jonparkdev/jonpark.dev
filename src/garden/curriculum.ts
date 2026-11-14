import { readFileSync } from "node:fs";

/** One Hello Interview section (or Tangent). Every Note belongs to exactly one Topic. */
export interface Topic {
  /** Stable key Notes use in their `topic` frontmatter. Never changes once Notes use it. */
  key: string;
  /** Display title. Free to change. */
  title: string;
}

/** An ordered group of Topics. */
export interface Part {
  title: string;
  topics: Topic[];
  /** True only for the Tangents Part, which is always last. */
  isTangents: boolean;
}

/**
 * A Part's display name. Part titles carry their syllabus number
 * ("03 Thinking in Scale"), set as "Part 3, Thinking in Scale".
 */
export function partLabel(part: Part): string {
  const numbered = /^(\d+)\s+(.+)$/.exec(part.title);
  if (part.isTangents || !numbered) return part.title;
  return `Part ${Number(numbered[1])}, ${numbered[2]}`;
}

/** The Hello Interview syllabus plus Tangents, in order. */
export interface Curriculum {
  /** Parts in syllabus order, with the Tangents Part always last. */
  parts: Part[];
  /** The Topic with this key, if the Curriculum defines it. */
  topic(key: string): Topic | undefined;
}

/**
 * The Curriculum as written in JSON (`src/curriculum.json`, or a test's
 * fixture). Tangents sit in their own field so they are last by construction.
 */
export interface CurriculumDefinition {
  parts: { title: string; topics: Topic[] }[];
  tangents?: Topic[];
}

const TANGENTS_TITLE = "🐇 Tangents";

/** Reads and checks the Curriculum JSON. Throws, naming the file, if it is malformed. */
export function loadCurriculum(path: string): Curriculum {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Curriculum ${path} is not valid JSON: ${(error as Error).message}`);
  }
  return toCurriculum(raw, path);
}

function toCurriculum(raw: unknown, path: string): Curriculum {
  const fail = (problem: string): never => {
    throw new Error(`Curriculum ${path}: ${problem}`);
  };
  if (!isObject(raw) || !Array.isArray(raw.parts)) fail('expected an object with a "parts" array');
  const definition = raw as Record<string, unknown> & { parts: unknown[] };

  const byKey = new Map<string, Topic>();
  const toTopics = (topics: unknown, where: string): Topic[] => {
    if (!Array.isArray(topics)) fail(`${where}: expected an array of topics`);
    return (topics as unknown[]).map((topic, i) => {
      if (!isObject(topic) || !isText(topic.key) || !isText(topic.title)) {
        fail(`${where}, topic ${i + 1} needs a non-empty "key" and "title"`);
      }
      const { key, title } = topic as { key: string; title: string };
      if (byKey.has(key)) fail(`topic key "${key}" is defined more than once`);
      const result = { key, title };
      byKey.set(key, result);
      return result;
    });
  };

  const parts: Part[] = definition.parts.map((part, i) => {
    if (!isObject(part) || !isText(part.title)) fail(`part ${i + 1} needs a non-empty "title"`);
    const { title, topics } = part as { title: string; topics: unknown };
    return { title, topics: toTopics(topics, `part "${title}"`), isTangents: false };
  });
  parts.push({
    title: TANGENTS_TITLE,
    topics: toTopics(definition.tangents ?? [], '"tangents"'),
    isTangents: true,
  });

  return { parts, topic: (key) => byKey.get(key) };
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}
