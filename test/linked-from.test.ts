import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

const curriculum = {
  parts: [{ title: "Core Concepts", topics: [{ key: "caching", title: "Caching" }] }],
};

const note = (body: string, stage = "seedling") => `---\nstage: ${stage}\ntopic: caching\n---\n${body}\n`;

/** The "Linked from" section of a page, or undefined if there is none. */
const linkedFrom = (html: string | undefined) =>
  /<section[^>]*class="[^"]*linked-from[^"]*"[^>]*>([\s\S]*?)<\/section>/.exec(html ?? "")?.[1];

/** The contents of each list item in a section. */
const items = (section: string | undefined) =>
  [...(section ?? "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);

test("a Note lists every Note that links to it, each with its Stage badge and a link", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Cache invalidation.md": note("Hard."),
      "Read-through cache.md": note("See [[Cache invalidation]].", "evergreen"),
      "Write-through cache.md": note("Also [[cache invalidation|invalidation]].", "budding"),
      "Unrelated.md": note("Nothing here."),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const section = linkedFrom(build.page("/notes/cache-invalidation"));
  expect(section).toContain("Linked from");
  const entries = items(section);
  expect(entries).toHaveLength(2);
  expect(entries[0]).toMatch(/<a[^>]*href="\/notes\/read-through-cache"[^>]*>Read-through cache<\/a>/);
  expect(entries[0]).toMatch(/class="stage-badge stage-evergreen"/);
  expect(entries[1]).toMatch(/<a[^>]*href="\/notes\/write-through-cache"[^>]*>Write-through cache<\/a>/);
  expect(entries[1]).toMatch(/class="stage-badge stage-budding"/);
});

test("a Note that links to another several times appears once in its Linked from list", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Cache invalidation.md": note("Hard."),
      "Read-through cache.md": note(
        "See [[Cache invalidation]], [[cache invalidation|again]] and [[Cache invalidation]].",
      ),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const entries = items(linkedFrom(build.page("/notes/cache-invalidation")));
  expect(entries).toHaveLength(1);
  expect(entries[0]).toContain(">Read-through cache</a>");
});

test("a Note with no backlinks has no Linked from section", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Cache invalidation.md": note("Later: [[Write-behind cache]]."),
      "Read-through cache.md": note("See [[Cache invalidation]]."),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/read-through-cache");
  expect(html).toMatch(/<h1[^>]*>Read-through cache<\/h1>/);
  expect(html).not.toContain("Linked from");
});
