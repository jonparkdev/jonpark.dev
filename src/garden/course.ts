import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** One section of a Curriculum (or a Tangent). A Note belongs to at most one Topic. */
export interface Topic {
  /** Key unique within its Course. Notes name it as `<course>/<key>`. Never changes once Notes use it. */
  key: string;
  /** Display title. Free to change. */
  title: string;
}

/** An ordered group of Topics within a Curriculum. */
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

/** A Course's syllabus as the garden arranges it: Parts in order, Tangents always last. */
export interface Curriculum {
  parts: Part[];
  /** The Topic with this key, if the Curriculum defines it. */
  topic(key: string): Topic | undefined;
  /** The Part holding this Topic. */
  partOf(topic: Topic): Part;
}

/** An external body of study the author follows, such as Hello Interview, with its Curriculum. */
export interface Course {
  /** The Course's file name without `.json`: its page URL and its prefix in Notes' `topic`. Never changes once Notes use it. */
  slug: string;
  title: string;
  /** One line shown under the title on the Course's page. */
  subtitle: string;
  curriculum: Curriculum;
}

/**
 * A Course as written in JSON (`src/courses/<slug>.json`, or a test's
 * fixture). Tangents sit in their own field so they are last by construction.
 */
export interface CourseDefinition {
  title: string;
  subtitle: string;
  parts: { title: string; topics: Topic[] }[];
  tangents?: Topic[];
}

/** Top-level site paths a Course slug may not take: the pages in `src/pages/` and the folders in `public/`. Keep in step with both. */
const RESERVED_SLUGS = ["notes", "about-stages", "fonts"];

const TANGENTS_TITLE = "🐇 Tangents";

/** Reads and checks every Course in the folder, ordered by title. Throws, naming the file, if one is malformed. */
export function loadCourses(dir: string): Course[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => loadCourse(join(dir, entry.name), entry.name.replace(/\.json$/, "")))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function loadCourse(path: string, slug: string): Course {
  const fail = (problem: string): never => {
    throw new Error(`Course ${path}: ${problem}`);
  };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`the file name "${slug}" must be a lowercase kebab-case slug`);
  if (RESERVED_SLUGS.includes(slug)) fail(`the slug "${slug}" is taken by a site page; rename the file`);

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`not valid JSON: ${(error as Error).message}`);
  }
  if (!isObject(raw) || !Array.isArray(raw.parts)) fail('expected an object with a "parts" array');
  const definition = raw as Record<string, unknown> & { parts: unknown[] };
  if (!isText(definition.title)) fail('needs a non-empty "title"');
  if (!isText(definition.subtitle)) fail('needs a non-empty "subtitle"');

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

  const partByTopic = new Map(parts.flatMap((part) => part.topics.map((topic) => [topic, part] as const)));
  return {
    slug,
    title: definition.title as string,
    subtitle: definition.subtitle as string,
    curriculum: { parts, topic: (key) => byKey.get(key), partOf: (topic) => partByTopic.get(topic)! },
  };
}

/** Where a Note sits in a Course: its Topic, and the Part holding it. */
export interface Placement {
  course: Course;
  part: Part;
  topic: Topic;
}

/** The page path of a Course. */
export function coursePath(course: Course): string {
  return `/${course.slug}`;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}
