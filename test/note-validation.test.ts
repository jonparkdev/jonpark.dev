import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

const curriculum = {
  parts: [{ title: "Core Concepts", topics: [{ key: "caching", title: "Caching" }] }],
  tangents: [{ key: "bloom-filters", title: "Bloom filters" }],
};

function buildWithNote(filename: string, frontmatter: string) {
  return buildGarden({ curriculum, notes: { [filename]: `---\n${frontmatter}\n---\nBody\n` } });
}

function output(build: { stdout: string; stderr: string }) {
  return build.stdout + build.stderr;
}

test.each([
  ["missing", "topic: caching"],
  ["invalid", "stage: sapling\ntopic: caching"],
])("a %s stage fails the build, naming the Note and field", (_, frontmatter) => {
  const build = buildWithNote("Write-through cache.md", frontmatter);

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": stage');
});

test("a Note with no frontmatter fails the build, naming the Note", () => {
  const build = buildGarden({ curriculum, notes: { "Bare note.md": "Just a body\n" } });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Bare note.md": stage is missing');
});

test("a topic not in the Curriculum fails the build, naming the Note and field", () => {
  const build = buildWithNote("Write-through cache.md", "stage: seedling\ntopic: cachng");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": topic "cachng"');
});

test("a Note can belong to a Tangent", () => {
  const build = buildWithNote("Counting bloom filters.md", "stage: seedling\ntopic: bloom-filters");

  expect(build.exitCode, output(build)).toBe(0);
  expect(build.page("/notes/counting-bloom-filters")).toContain("Bloom filters");
});

test("an invalid upgrades value fails the build, naming the Note and field", () => {
  const build = buildWithNote("Write-through cache.md", "stage: seedling\ntopic: caching\nupgrades: [diagram, video]");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": upgrades value "video"');
});

test("valid upgrades are accepted but not rendered", () => {
  const build = buildWithNote(
    "Write-through cache.md",
    "stage: seedling\ntopic: caching\nupgrades:\n  - diagram\n  - interactive\n  - explainer",
  );

  expect(build.exitCode, output(build)).toBe(0);
  const html = build.page("/notes/write-through-cache") ?? "";
  expect(html).toContain("Body");
  expect(html).not.toMatch(/diagram|interactive|explainer/i);
});

test("any other frontmatter field fails the build, naming the Note and field", () => {
  const build = buildWithNote("Write-through cache.md", "stage: seedling\ntopic: caching\ndraft: true");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": unknown field "draft"');
});

test("two Notes with the same slug fail the build, naming both", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "Write-through cache.md": "---\nstage: seedling\ntopic: caching\n---\nOne\n",
      "Write through cache.md": "---\nstage: budding\ntopic: caching\n---\nTwo\n",
    },
  });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('"Write through cache.md" and "Write-through cache.md"');
  expect(output(build)).toContain('"write-through-cache"');
});

test("every invalid Note is reported in one failed build", () => {
  const build = buildGarden({
    curriculum,
    notes: {
      "First.md": "---\nstage: sapling\ntopic: caching\n---\n",
      "Second.md": "---\nstage: seedling\ntopic: nope\n---\n",
    },
  });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "First.md": stage');
  expect(output(build)).toContain('Note "Second.md": topic');
});
