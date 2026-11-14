import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const curriculum = {
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
  return `---\nstage: ${stage}\ntopic: ${topic}\n---\nBody\n`;
}

/** Positions of each needle in the haystack, failing if any is missing. */
function positions(html: string, needles: string[]): number[] {
  return needles.map((needle) => {
    const at = html.indexOf(needle);
    expect(at, `"${needle}" on the home page`).toBeGreaterThanOrEqual(0);
    return at;
  });
}

/** The HTML of one Topic's entry on the Topic index: up to the next Topic, or Recently tended. */
function topicEntry(html: string, key: string): string {
  const start = html.indexOf(`data-topic="${key}"`);
  expect(start, `Topic "${key}" on the Topic index`).toBeGreaterThanOrEqual(0);
  const next = html.indexOf('data-topic="', start + 1);
  return html.slice(start, next === -1 ? html.indexOf("data-recently-tended", start) : next);
}

test("the Topic index shows only Topics with Notes, under their Parts, in Curriculum order with Tangents last", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "Cache aside.md": note("seedling", "caching"),
      "Read replicas.md": note("budding", "scaling"),
      "Kafka basics.md": note("seedling", "kafka"),
      "Bloom filter basics.md": note("evergreen", "bloom-filters"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
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
    curriculum,
    notes: { "Cache aside.md": note("seedling", "caching") },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
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
    curriculum,
    notes: {
      "Write through.md": note("seedling", "caching"),
      "Cache aside.md": note("budding", "caching"),
      "Bloom filter basics.md": note("evergreen", "bloom-filters"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  const noteItem = (slug: string, title: string, badge: string) =>
    new RegExp(`<a href="/notes/${slug}"[^>]*>${title}</a>\\s*<a[^>]*href="/about-stages"[^>]*>${badge}</a>`);

  const caching = topicEntry(html, "caching");
  expect(caching).toMatch(/<h3[^>]*>Caching<\/h3>/);
  expect(caching).toMatch(noteItem("cache-aside", "Cache aside", "🌿 Budding"));
  expect(caching).toMatch(noteItem("write-through", "Write through", "🌱 Seedling"));
  expect(caching.indexOf("Cache aside")).toBeLessThan(caching.indexOf("Write through"));
  expect(caching).not.toContain("Bloom filter basics");
  expect(topicEntry(html, "bloom-filters")).toMatch(noteItem("bloom-filter-basics", "Bloom filter basics", "🌳 Evergreen"));
});

test("an empty garden says there are no Notes yet", () => {
  const build = buildFixtureSite({ curriculum });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  expect(html).toContain("No Notes yet.");
  expect(html).not.toContain("data-recently-tended");
});

test("the home page shows the text the hosting wizard checks for", () => {
  const script = readFileSync(new URL("../scripts/setup-hosting.sh", import.meta.url), "utf8");
  const expected = /^HOME_PAGE_TEXT="(.+)"/m.exec(script)?.[1] ?? "";
  expect(expected, "HOME_PAGE_TEXT in scripts/setup-hosting.sh").not.toBe("");

  const build = buildFixtureSite({ curriculum });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/")).toContain(expected);
});
