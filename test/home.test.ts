import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const curriculum = {
  parts: [
    {
      title: "Core Concepts",
      topics: [
        { key: "scaling", title: "Scaling Reads" },
        { key: "caching", title: "Caching" },
      ],
    },
    {
      title: "Key Technologies",
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

/** The HTML of one Topic's entry on the Progress map: up to the next Topic, or the end of the Progress map. */
function topicEntry(html: string, key: string): string {
  const start = html.indexOf(`data-topic="${key}"`);
  expect(start, `Topic "${key}" on the Progress map`).toBeGreaterThanOrEqual(0);
  const next = html.indexOf('data-topic="', start + 1);
  return html.slice(start, next === -1 ? html.indexOf("data-recently-tended", start) : next);
}

test("the home page shows every Part and its Topics in Curriculum order, with Tangents last", () => {
  const build = buildFixtureSite({ curriculum });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  const order = positions(html, [
    "Core Concepts",
    "Scaling Reads",
    "Caching",
    "Key Technologies",
    "Redis",
    "Kafka",
    "🐇 Tangents",
    "Bloom filters",
  ]);
  expect(order).toEqual([...order].sort((a, b) => a - b));
});

test("each Topic is marked with the Stage of its most advanced Note", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "A cache aside.md": note("seedling", "caching"),
      "B write through.md": note("evergreen", "caching"),
      "C write back.md": note("budding", "caching"),
      "Read replicas.md": note("budding", "scaling"),
      "Sharding.md": note("seedling", "scaling"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  expect(topicEntry(html, "caching")).toMatch(/class="topic-stage"><a[^>]*>🌳 Evergreen<\/a>/);
  expect(topicEntry(html, "scaling")).toMatch(/class="topic-stage"><a[^>]*>🌿 Budding<\/a>/);
});

test("each Topic shows how many 🌱, 🌿 and 🌳 Notes it has", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "Cache aside.md": note("seedling", "caching"),
      "Cache stampede.md": note("seedling", "caching"),
      "Write through.md": note("budding", "caching"),
      "Sharding.md": note("evergreen", "scaling"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  expect(topicEntry(html, "caching")).toContain('<span class="topic-counts">🌱 2 · 🌿 1 · 🌳 0</span>');
  expect(topicEntry(html, "scaling")).toContain('<span class="topic-counts">🌱 0 · 🌿 0 · 🌳 1</span>');
});

test("Topics with no Notes stay visible, marked untouched", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "Cache aside.md": note("seedling", "caching") },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  for (const key of ["scaling", "redis", "kafka", "bloom-filters"]) {
    expect(topicEntry(html, key)).toMatch(/class="topic-stage untouched"[^>]*>untouched</);
  }
  expect(topicEntry(html, "caching")).not.toContain("untouched");
});

test("each Topic lists its Notes, each linking to its page with its Stage badge", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "Cache aside.md": note("budding", "caching"),
      "Write through.md": note("seedling", "caching"),
      "Bloom filter basics.md": note("evergreen", "bloom-filters"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  const noteItem = (slug: string, title: string, badge: string) =>
    new RegExp(`<a href="/notes/${slug}"[^>]*>${title}</a>\\s*<a[^>]*href="/about-stages"[^>]*>${badge}</a>`);

  const caching = topicEntry(html, "caching");
  expect(caching).toMatch(noteItem("cache-aside", "Cache aside", "🌿 Budding"));
  expect(caching).toMatch(noteItem("write-through", "Write through", "🌱 Seedling"));
  expect(caching).not.toContain("Bloom filter basics");
  expect(topicEntry(html, "bloom-filters")).toMatch(noteItem("bloom-filter-basics", "Bloom filter basics", "🌳 Evergreen"));
});

test("the home page shows the text the hosting wizard checks for", () => {
  const script = readFileSync(new URL("../scripts/setup-hosting.sh", import.meta.url), "utf8");
  const expected = /^HOME_PAGE_TEXT="(.+)"/m.exec(script)?.[1] ?? "";
  expect(expected, "HOME_PAGE_TEXT in scripts/setup-hosting.sh").not.toBe("");

  const build = buildFixtureSite({ curriculum });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/")).toContain(expected);
});
