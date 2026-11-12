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
