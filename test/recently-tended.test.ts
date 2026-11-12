import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

const curriculum = {
  parts: [{ title: "Core Concepts", topics: [{ key: "caching", title: "Caching" }] }],
};

function note(stage: string): string {
  return `---\nstage: ${stage}\ntopic: caching\n---\nBody\n`;
}

/** The Recently tended section of the home page. */
function recentlyTended(html: string): string {
  const start = html.indexOf("data-recently-tended");
  expect(start, "Recently tended section on the home page").toBeGreaterThanOrEqual(0);
  return html.slice(start, html.indexOf("</section>", start));
}

/** Each listed entry, in page order. */
function entries(section: string): string[] {
  return section.split("<li").slice(1);
}

test("the home page lists the five most recently Tended Notes below the Progress map, newest first, with badges and dates", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Alpha.md": note("seedling"),
      "Bravo.md": note("budding"),
      "Charlie.md": note("evergreen"),
      "Delta.md": note("seedling"),
      "Echo.md": note("budding"),
      "Foxtrot.md": note("evergreen"),
    },
    commits: [
      // An earlier version of Alpha; only its last commit counts.
      { date: "2025-12-01T12:00:00Z", notes: { "Alpha.md": "---\nstage: seedling\ntopic: caching\n---\nDraft\n" } },
      { date: "2026-01-05T12:00:00Z", notes: ["Charlie.md"] },
      { date: "2026-02-10T12:00:00Z", notes: ["Alpha.md", "Foxtrot.md"] },
      { date: "2026-03-01T12:00:00Z", notes: ["Echo.md"] },
      { date: "2026-03-20T12:00:00Z", notes: ["Bravo.md"] },
      { date: "2026-04-02T12:00:00Z", notes: ["Delta.md"] },
    ],
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  expect(html.indexOf("data-recently-tended")).toBeGreaterThan(html.indexOf('data-topic="caching"'));
  const section = recentlyTended(html);
  expect(section).toContain("Recently tended");

  const listed = entries(section);
  expect(listed).toHaveLength(5);
  const expected = [
    ["Delta", "delta", "seedling", "2026-04-02"],
    ["Bravo", "bravo", "budding", "2026-03-20"],
    ["Echo", "echo", "budding", "2026-03-01"],
    // Alpha and Foxtrot share a commit; ties are by title.
    ["Alpha", "alpha", "seedling", "2026-02-10"],
    ["Foxtrot", "foxtrot", "evergreen", "2026-02-10"],
  ];
  expected.forEach(([title, slug, stage, date], i) => {
    expect(listed[i]).toContain(`<a href="/notes/${slug}">${title}</a>`);
    expect(listed[i]).toContain(`stage-badge stage-${stage}`);
    expect(listed[i]).toContain(`<time datetime="${date}">${date}</time>`);
  });
  expect(section).not.toContain("Charlie");
});
