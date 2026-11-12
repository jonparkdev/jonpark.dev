import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

const curriculum = {
  parts: [{ title: "Core Concepts", topics: [{ key: "caching", title: "Caching" }] }],
};

const note = (body: string) => `---\nstage: seedling\ntopic: caching\n---\n${body}\n`;

test("[[Note title]] renders as a link to that Note's page", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Read-through cache.md": note("See [[Cache invalidation]] for the hard part."),
      "Cache invalidation.md": note("Hard."),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/notes/read-through-cache")).toMatch(
    /See <a[^>]*href="\/notes\/cache-invalidation"[^>]*>Cache invalidation<\/a> for the hard part\./,
  );
});

test("wikilinks match the Note's filename ignoring case", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Read-through cache.md": note("See [[cache INVALIDATION]]."),
      "Cache invalidation.md": note("Hard."),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/notes/read-through-cache")).toMatch(
    /<a[^>]*href="\/notes\/cache-invalidation"[^>]*>cache INVALIDATION<\/a>/,
  );
});

test("[[Note title|label]] shows the label and links to the Note", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Read-through cache.md": note("Then [[Cache invalidation|it gets hard]]."),
      "Cache invalidation.md": note("Hard."),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/read-through-cache");
  expect(html).toMatch(/Then <a[^>]*href="\/notes\/cache-invalidation"[^>]*>it gets hard<\/a>\./);
  expect(html).not.toContain("Cache invalidation|");
});

test("[[Note#Heading]] links to the Note page, ignoring the heading", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Read-through cache.md": note("See [[Cache invalidation#TTLs]] and [[Cache invalidation#TTLs|TTLs]]."),
      "Cache invalidation.md": note("## TTLs\nHard."),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/notes/read-through-cache")).toMatch(
    /See <a[^>]*href="\/notes\/cache-invalidation"[^>]*>Cache invalidation<\/a> and <a[^>]*href="\/notes\/cache-invalidation"[^>]*>TTLs<\/a>\./,
  );
});
