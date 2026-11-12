import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const curriculum = {
  parts: [{ title: "Core Concepts", topics: [{ key: "hashing", title: "Consistent Hashing" }] }],
};

const note = (body: string) => `---\nstage: seedling\ntopic: hashing\nupgrades: [diagram]\n---\n${body}\n`;

const ring = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle id="ring" cx="5" cy="5" r="4"/></svg>';

test("![[name.svg]] shows the Diagram from the assets folder inline", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "Consistent hashing.md": note("Keys sit on a ring:\n\n![[ring.svg]]\n\nThen nodes join.") },
    assets: { "ring.svg": `<?xml version="1.0" encoding="UTF-8"?>\n${ring}\n` },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/consistent-hashing") ?? "";
  expect(html).toContain('<circle id="ring" cx="5" cy="5" r="4"/>');
  expect(html).not.toContain("![[ring.svg]]");
  expect(html).not.toContain("<?xml");
  expect(html.indexOf("Keys sit on a ring")).toBeLessThan(html.indexOf('id="ring"'));
  expect(html.indexOf('id="ring"')).toBeLessThan(html.indexOf("Then nodes join"));
});

test("a missing Diagram asset fails the build, naming the Note and the file", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "Consistent hashing.md": note("![[missing-ring.svg]]") },
  });

  const output = build.stdout + build.stderr;
  expect(build.exitCode, output).not.toBe(0);
  expect(output).toMatch(/Note "Consistent hashing\.md":[^\n]*missing-ring\.svg/);
});

test("![[Note]] embedding a written Note renders as a link to it, like [[Note]]", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "Consistent hashing.md": note("See ![[Virtual nodes]] and ![[Virtual nodes|vnodes]]."),
      "Virtual nodes.md": note("Body"),
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/consistent-hashing") ?? "";
  expect(html).toContain('<a class="wikilink" href="/notes/virtual-nodes">Virtual nodes</a>');
  expect(html).toContain('<a class="wikilink" href="/notes/virtual-nodes">vnodes</a>');
  expect(html).not.toContain("![[");
  expect(html).not.toContain('class="diagram"');
  expect(build.page("/notes/virtual-nodes")).toContain('href="/notes/consistent-hashing"');
});

test("![[target]] for anything but an .svg never fails the build and is never inlined", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "Consistent hashing.md": note("See ![[Unwritten idea]] and ![[photo.png]].") },
    assets: { "photo.png": "not really a png" },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/consistent-hashing") ?? "";
  expect(html).toContain('<span class="wikilink unwritten" title="Not written yet">Unwritten idea</span>');
  expect(html).toContain('<span class="wikilink unwritten" title="Not written yet">photo.png</span>');
  expect(html).not.toContain("not really a png");
  expect(html).not.toContain('class="diagram"');
});
