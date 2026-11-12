import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const curriculum = {
  parts: [{ title: "Core Concepts", topics: [{ key: "caching", title: "Caching" }] }],
  tangents: [{ key: "bloom-filters", title: "Bloom filters" }],
};

function buildWithNote(filename: string, frontmatter: string) {
  return buildFixtureSite({ curriculum, notes: { [filename]: `---\n${frontmatter}\n---\nBody\n` } });
}

function output(build: { stdout: string; stderr: string }) {
  return build.stdout + build.stderr;
}

/** The Note's own content on its page: title, Stage badge, Topic and body, without the site's chrome. */
function article(html: string): string {
  const start = html.indexOf("<article");
  expect(start, "the Note's <article>").toBeGreaterThanOrEqual(0);
  return html.slice(start, html.indexOf("</article>", start));
}

test("a missing stage fails the build, naming the Note and field", () => {
  const build = buildWithNote("Write-through cache.md", "topic: caching");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": stage is missing');
});

test("an invalid stage fails the build, naming the Note, field and value", () => {
  const build = buildWithNote("Write-through cache.md", "stage: sapling\ntopic: caching");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": stage "sapling"');
});

test("a Note with no frontmatter fails the build, naming the Note", () => {
  const build = buildFixtureSite({ curriculum, notes: { "Bare note.md": "Just a body\n" } });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Bare note.md": stage is missing');
});

test("a missing topic fails the build, naming the Note and field", () => {
  const build = buildWithNote("Write-through cache.md", "stage: seedling");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": topic is missing');
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

test("upgrades that are not a list fail the build, naming the Note and field", () => {
  const build = buildWithNote("Write-through cache.md", "stage: seedling\ntopic: caching\nupgrades: diagram");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": upgrades must be a list');
});

test("valid upgrades are accepted but not rendered", () => {
  const build = buildWithNote(
    "Write-through cache.md",
    "stage: seedling\ntopic: caching\nupgrades:\n  - diagram\n  - interactive\n  - explainer",
  );

  expect(build.exitCode, output(build)).toBe(0);
  const content = article(build.page("/notes/write-through-cache") ?? "");
  expect(content).toContain("Body");
  expect(content).not.toMatch(/diagram|interactive|explainer/i);
});

test("frontmatter that is not valid YAML fails the build, naming the Note", () => {
  const build = buildWithNote("Write-through cache.md", "stage: seedling\ntopic: [caching");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": frontmatter is not valid YAML');
});

test("any other frontmatter field fails the build, naming the Note and field", () => {
  const build = buildWithNote("Write-through cache.md", "stage: seedling\ntopic: caching\ndraft: true");

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Write-through cache.md": unknown field "draft"');
});

test("two Notes with the same slug fail the build, naming both", () => {
  const build = buildFixtureSite({
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
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "First.md": "---\nstage: sapling\ntopic: caching\n---\n",
      "Second.md": "---\nstage: seedling\ntopic: nope\n---\n",
      "Third.md": "---\ntopic: caching\n---\n",
    },
  });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "First.md": stage "sapling"');
  expect(output(build)).toContain('Note "Second.md": topic "nope"');
  expect(output(build)).toContain('Note "Third.md": stage is missing');
});
