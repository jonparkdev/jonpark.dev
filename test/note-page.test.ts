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
  ],
};

test("a Note renders at /notes/<slug> with its filename as title, Topic and body", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "Consistent Hashing.md": "---\nstage: budding\ntopic: scaling\n---\nKeys map onto a **ring**.\n",
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/consistent-hashing");
  expect(html).toBeDefined();
  expect(html).toContain("<title>Consistent Hashing</title>");
  expect(html).toMatch(/<h1[^>]*>Consistent Hashing<\/h1>/);
  expect(html).toContain("Scaling Reads");
  expect(html).toContain("Keys map onto a <strong>ring</strong>.");
});

test.each([
  ["seedling", "🌱 Seedling"],
  ["budding", "🌿 Budding"],
  ["evergreen", "🌳 Evergreen"],
])("a %s Note shows its Stage badge, linking to /about-stages", (stage, badge) => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "Caching basics.md": `---\nstage: ${stage}\ntopic: caching\n---\nBody\n` },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/caching-basics") ?? "";
  expect(html).toMatch(new RegExp(`<a[^>]*href="/about-stages"[^>]*>${badge}</a>`));
});

test("the slug is the kebab-case of the filename", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "CAP theorem: why  P is given.md": "---\nstage: seedling\ntopic: scaling\n---\nBody\n" },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/notes/cap-theorem-why-p-is-given")).toBeDefined();
});
