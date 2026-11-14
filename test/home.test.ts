import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { tendedLong } from "../src/garden/tended";
import { buildFixtureSite } from "./helpers/build-fixture-site";

/** How the page writes a YYYY-MM-DD date. */
const long = (day: string) => tendedLong(new Date(`${day}T00:00:00Z`));

/** The <time> element for a Tended day, allowing for attributes the page adds. */
const timeOf = (day: string) => new RegExp(`<time datetime="${day}"[^>]*>${long(day)}</time>`);

const course = {
  title: "Test Course",
  subtitle: "A course for tests.",
  parts: [{ title: "Core Concepts", topics: [{ key: "caching", title: "Caching" }] }],
};
const other = { ...course, title: "Other Course" };

function note(stage: string, topic = "course/caching"): string {
  return `---\nstage: ${stage}\ntopic: ${topic}\n---\nBody\n`;
}

/** The home page's list of Notes. */
function noteList(html: string): string {
  const start = html.indexOf("data-note-list");
  expect(start, "the Note list on the home page").toBeGreaterThanOrEqual(0);
  return html.slice(start, html.indexOf("</ol>", start));
}

/** Each listed entry, in page order. */
function entries(list: string): string[] {
  return list.split("<li").slice(1);
}

test("the home page lists every Note, whatever its Course or none, newest Tended first, with badges and dates", () => {
  const build = buildFixtureSite({
    courses: { course, other },
    notes: {
      "Alpha.md": note("seedling"),
      "Bravo.md": note("budding", "other/caching"),
      "Charlie.md": note("evergreen"),
      "Delta.md": "---\nstage: seedling\n---\nOn its own\n",
      "Echo.md": note("budding"),
      "Foxtrot.md": note("evergreen"),
    },
    commits: [
      // An earlier version of Alpha; only its last commit counts.
      { date: "2025-12-01T12:00:00Z", notes: { "Alpha.md": "---\nstage: seedling\ntopic: course/caching\n---\nDraft\n" } },
      { date: "2026-01-05T12:00:00Z", notes: ["Charlie.md"] },
      { date: "2026-02-10T12:00:00Z", notes: ["Alpha.md", "Foxtrot.md"] },
      { date: "2026-03-01T12:00:00Z", notes: ["Echo.md"] },
      { date: "2026-03-20T12:00:00Z", notes: ["Bravo.md"] },
      { date: "2026-04-02T12:00:00Z", notes: ["Delta.md"] },
    ],
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  const expected = [
    ["Delta", "delta", "seedling", "2026-04-02"],
    ["Bravo", "bravo", "budding", "2026-03-20"],
    ["Echo", "echo", "budding", "2026-03-01"],
    // Alpha and Foxtrot share a commit; ties are by title.
    ["Alpha", "alpha", "seedling", "2026-02-10"],
    ["Foxtrot", "foxtrot", "evergreen", "2026-02-10"],
    ["Charlie", "charlie", "evergreen", "2026-01-05"],
  ];
  const listed = entries(noteList(html));
  expect(listed).toHaveLength(expected.length);
  expected.forEach(([title, slug, stage, date], i) => {
    expect(listed[i]).toContain(`<a href="/notes/${slug}">${title}</a>`);
    expect(listed[i]).toContain(`stage-badge stage-${stage}`);
    expect(listed[i]).toMatch(timeOf(date));
  });
});

test("the home page has no Topic index and no Recently tended heading", () => {
  const build = buildFixtureSite({ courses: { course }, notes: { "Alpha.md": note("seedling") } });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  expect(noteList(html)).toContain("Alpha");
  expect(html).not.toContain("data-topic=");
  expect(html).not.toContain("Recently tended");
});

test("a Note is Tended when its change was written, not when a rebase or squash-merge re-committed it", () => {
  const build = buildFixtureSite({
    courses: { course },
    notes: { "Older.md": note("seedling"), "Rebased.md": note("budding") },
    commits: [
      { date: "2026-02-01T12:00:00Z", notes: ["Older.md"] },
      { date: "2026-01-05T12:00:00Z", committedDate: "2026-06-01T12:00:00Z", notes: ["Rebased.md"] },
    ],
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const listed = entries(noteList(build.page("/") ?? ""));
  expect(listed[0]).toMatch(timeOf("2026-02-01"));
  expect(listed[1]).toContain('<a href="/notes/rebased">Rebased</a>');
  expect(listed[1]).toMatch(timeOf("2026-01-05"));
});

test("an uncommitted Note counts as tended now", () => {
  const before = new Date().toISOString().slice(0, 10);
  const build = buildFixtureSite({
    courses: { course },
    notes: { "Committed.md": note("budding"), "Fresh.md": note("seedling") },
    commits: [{ date: "2026-01-05T12:00:00Z", notes: ["Committed.md"] }],
  });
  const after = new Date().toISOString().slice(0, 10);

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const listed = entries(noteList(build.page("/") ?? ""));
  expect(listed).toHaveLength(2);
  expect(listed[0]).toContain('<a href="/notes/fresh">Fresh</a>');
  const today = /<time datetime="(\d{4}-\d{2}-\d{2})"/.exec(listed[0])?.[1];
  expect([before, after]).toContain(today);
  expect(listed[1]).toMatch(timeOf("2026-01-05"));
});

test("an empty garden says there are no Notes yet", () => {
  const build = buildFixtureSite({ courses: { course } });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/") ?? "";
  expect(html).toContain("No Notes yet.");
  expect(html).not.toContain("data-note-list");
});

test("the home page shows the tagline the hosting wizard checks for", () => {
  const script = readFileSync(new URL("../scripts/setup-hosting.sh", import.meta.url), "utf8");
  const expected = /^HOME_PAGE_TEXT="(.+)"/m.exec(script)?.[1] ?? "";
  expect(expected, "HOME_PAGE_TEXT in scripts/setup-hosting.sh").toBe("A garden of notes on what I'm learning.");

  const build = buildFixtureSite({ courses: { course } });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/")).toContain(expected);
});
