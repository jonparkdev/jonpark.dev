import { join } from "node:path";
import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const hellointerview = {
  title: "Hello Interview",
  subtitle: "System design notes, organised by the Hello Interview curriculum.",
  parts: [{ title: "03 Thinking in Scale", topics: [{ key: "caching", title: "Caching" }] }],
};

const note = (topic: string) => `---\nstage: seedling\ntopic: ${topic}\n---\nBody\n`;
const output = (build: { stdout: string; stderr: string }) => build.stdout + build.stderr;

test("a Note's topic names its Course and Topic as <course>/<key>", () => {
  const build = buildFixtureSite({
    courses: { hellointerview },
    notes: { "Cache aside.md": note("hellointerview/caching") },
  });

  expect(build.exitCode, output(build)).toBe(0);
  expect(build.page("/notes/cache-aside")).toContain("Caching");
});

test("a bare topic key fails the build, suggesting the Course that has it", () => {
  const build = buildFixtureSite({ courses: { hellointerview }, notes: { "Cache aside.md": note("caching") } });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain(
    'Note "Cache aside.md": topic "caching" must name its Course, as <course>/<key>; did you mean "hellointerview/caching"?',
  );
});

test("a topic naming an unknown Course fails the build, listing the Courses", () => {
  const build = buildFixtureSite({ courses: { hellointerview }, notes: { "Cache aside.md": note("ddia/caching") } });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain('Note "Cache aside.md": topic "ddia/caching" names no Course "ddia"; Courses are: hellointerview');
});

test("two Courses may use the same Topic key; each Note lands in the Course it names", () => {
  const ddia = { ...hellointerview, title: "Designing Data-Intensive Applications" };
  const build = buildFixtureSite({
    courses: { hellointerview, ddia },
    notes: { "Cache aside.md": note("hellointerview/caching"), "Read-through.md": note("ddia/caching") },
  });

  expect(build.exitCode, output(build)).toBe(0);
  expect(build.page("/notes/cache-aside")).toMatch(/<a href="\/hellointerview"[^>]*>Hello Interview<\/a>/);
  expect(build.page("/notes/read-through")).toMatch(/<a href="\/ddia"[^>]*>Designing Data-Intensive Applications<\/a>/);
  expect(build.page("/ddia")).toContain("Read-through");
  expect(build.page("/ddia")).not.toContain("Cache aside");
});

test("a Topic key defined twice in one Course fails the build, naming the Course file and key", () => {
  const build = buildFixtureSite({
    courses: { hellointerview: { ...hellointerview, tangents: [{ key: "caching", title: "Caching again" }] } },
  });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain(`Course ${join(build.coursesDir, "hellointerview.json")}: topic key "caching" is defined more than once`);
});

test("a malformed Course fails the build, naming the Course file", () => {
  const build = buildFixtureSite({ courses: { hellointerview: { parts: [{ topics: [] }] } } });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain(`Course ${join(build.coursesDir, "hellointerview.json")}`);
});

test.each(["notes", "about-stages", "fonts"])("a Course whose slug is taken by a site path (%s) fails the build", (slug) => {
  const build = buildFixtureSite({ courses: { [slug]: hellointerview } });

  expect(build.exitCode).not.toBe(0);
  expect(output(build)).toContain(`the slug "${slug}" is taken by a site page`);
});
