import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

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

/** The HTML of one Topic's entry on the Progress map: up to the next Topic, or the end of the page. */
function topicEntry(html: string, key: string): string {
  const start = html.indexOf(`data-topic="${key}"`);
  expect(start, `Topic "${key}" on the Progress map`).toBeGreaterThanOrEqual(0);
  const next = html.indexOf('data-topic="', start + 1);
  return html.slice(start, next === -1 ? html.indexOf("</main>", start) : next);
}

test("the home page shows every Part and its Topics in Curriculum order, with Tangents last", () => {
  const build = buildGarden({ curriculum });

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
  const build = buildGarden({
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
  expect(topicEntry(html, "caching")).toMatch(/class="topic-stage"[^>]*>[\s\S]*?🌳 Evergreen/);
  expect(topicEntry(html, "scaling")).toMatch(/class="topic-stage"[^>]*>[\s\S]*?🌿 Budding/);
});
