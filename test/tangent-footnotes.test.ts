import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const curriculum = {
  parts: [{ title: "03 Thinking in Scale", topics: [{ key: "caching", title: "Caching" }] }],
  tangents: [{ key: "herds", title: "Thundering Herds" }],
};

test("a link to a Tangent Note gets a 🐇 footnote mark and a footnote naming it", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: {
      "Cache-aside.md": "---\nstage: seedling\ntopic: caching\n---\nMisses stampede: [[Thundering herd]]. Again [[thundering herd|the herd]].\n",
      "Thundering herd.md": "---\nstage: budding\ntopic: herds\n---\nBack to [[Cache-aside]].\n",
    },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/cache-aside") ?? "";
  // Both mentions point at the same footnote.
  expect(html.match(/<sup class="tangent-mark"><a href="#tangent-1"[^>]*>🐇1<\/a><\/sup>/g)).toHaveLength(2);
  expect(html).not.toContain("#tangent-2");
  expect(html).toMatch(/<li id="tangent-1"[^>]*>[\s\S]*?<a[^>]*href="\/notes\/thundering-herd"[^>]*>Thundering herd<\/a>/);

  // A Tangent's own links to non-Tangents get no footnote.
  const tangent = build.page("/notes/thundering-herd") ?? "";
  expect(tangent).not.toContain('<sup class="tangent-mark"');
});

test("the title block names the Topic and the numbered Part", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "Cache-aside.md": "---\nstage: seedling\ntopic: caching\n---\nBody\n" },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  expect(build.page("/notes/cache-aside")).toContain("Caching · Part 3, Thinking in Scale");
});

test("code blocks render one numbered line per source line", () => {
  const build = buildFixtureSite({
    curriculum,
    notes: { "Cache-aside.md": "---\nstage: seedling\ntopic: caching\n---\n```python\na = 1 < 2\nb = 3\n```\n" },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/notes/cache-aside") ?? "";
  expect(html).toContain('<pre class="listing" data-lang="python"><code><span class="line">a = 1 &#60; 2</span>\n<span class="line">b = 3</span></code></pre>');
});
