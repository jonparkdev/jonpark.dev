import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const course = {
  title: "Test Course",
  subtitle: "A course for tests.",
  parts: [
    {
      title: "03 Thinking in Scale",
      topics: [
        { key: "scaling", title: "Scaling Reads" },
        { key: "caching", title: "Caching" },
      ],
    },
    {
      title: "04 Key Technologies",
      topics: [
        { key: "redis", title: "Redis" },
        { key: "kafka", title: "Kafka" },
      ],
    },
  ],
  tangents: [{ key: "bloom-filters", title: "Bloom filters" }],
};

function note(stage: string, topic: string): string {
  return `---\nstage: ${stage}\ntopic: course/${topic}\n---\nBody\n`;
}

/** Positions of each needle in the haystack, failing if any is missing. */
function positions(html: string, needles: string[]): number[] {
  return needles.map((needle) => {
    const at = html.indexOf(needle);
    expect(at, `"${needle}" on the Course page`).toBeGreaterThanOrEqual(0);
    return at;
  });
}

/** The HTML of one Topic's entry on the Topic index: up to the next Topic, or the end of the index. */
function topicEntry(html: string, key: string): string {
  const start = html.indexOf(`data-topic="${key}"`);
  expect(start, `Topic "${key}" on the Topic index`).toBeGreaterThanOrEqual(0);
  const next = html.indexOf('data-topic="', start + 1);
  return html.slice(start, next === -1 ? html.indexOf("</main>", start) : next);
}

test("the Topic index shows only Topics with Notes, under their Parts, in Curriculum order with Tangents last", () => {
  const build = buildFixtureSite({
    courses: { course },
    notes: {
      "Cache aside.md": note("seedling", "caching"),
      "Read replicas.md": note("budding", "scaling"),
      "Kafka basics.md": note("seedling", "kafka"),
      "Bloom filter basics.md": note("evergreen", "bloom-filters"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/course") ?? "";
  const order = positions(html, [
    "Part 3, Thinking in Scale",
    'data-topic="scaling"',
    'data-topic="caching"',
    "Part 4, Key Technologies",
    'data-topic="kafka"',
    "🐇 Tangents",
    'data-topic="bloom-filters"',
  ]);
  expect(order).toEqual([...order].sort((a, b) => a - b));
  expect(html).not.toContain('data-topic="redis"');
});

test("Topics and Parts without Notes are left out, with no untouched marks or per-Stage counts", () => {
  const build = buildFixtureSite({
    courses: { course },
    notes: { "Cache aside.md": note("seedling", "caching") },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/course") ?? "";
  expect(html).toContain('data-topic="caching"');
  for (const key of ["scaling", "redis", "kafka", "bloom-filters"]) {
    expect(html).not.toContain(`data-topic="${key}"`);
  }
  expect(html).not.toContain("Key Technologies");
  expect(html).not.toContain("🐇 Tangents");
  expect(html).not.toContain("untouched");
  expect(html).not.toContain("topic-counts");
});

test("each Topic lists its Notes by title, each linking to its page with its Stage badge", () => {
  const build = buildFixtureSite({
    courses: { course },
    notes: {
      "Write through.md": note("seedling", "caching"),
      "Cache aside.md": note("budding", "caching"),
      "Bloom filter basics.md": note("evergreen", "bloom-filters"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/course") ?? "";
  const noteItem = (slug: string, title: string, badge: string) =>
    new RegExp(`<a href="/notes/${slug}"[^>]*>${title}</a>\\s*<a[^>]*href="/about-stages"[^>]*>${badge}</a>`);

  const caching = topicEntry(html, "caching");
  expect(caching).toMatch(/<h3[^>]*>Caching<\/h3>/);
  expect(caching).toMatch(noteItem("cache-aside", "Cache aside", "<span aria-hidden=\"true\">🌿</span> Budding"));
  expect(caching).toMatch(noteItem("write-through", "Write through", "<span aria-hidden=\"true\">🌱</span> Seedling"));
  expect(caching.indexOf("Cache aside")).toBeLessThan(caching.indexOf("Write through"));
  expect(caching).not.toContain("Bloom filter basics");
  expect(topicEntry(html, "bloom-filters")).toMatch(noteItem("bloom-filter-basics", "Bloom filter basics", "<span aria-hidden=\"true\">🌳</span> Evergreen"));
});

test("a Course's page is titled with the Course and its subtitle, and has no recent list", () => {
  const build = buildFixtureSite({
    courses: { course },
    notes: { "Cache aside.md": note("seedling", "caching") },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/course") ?? "";
  expect(html).toMatch(/<h1[^>]*>Test Course<\/h1>/);
  expect(html).toContain("A course for tests.");
  expect(html).toMatch(/<title>[^<]*Test Course[^<]*<\/title>/);
  expect(html).not.toContain("data-recently-tended");
});
