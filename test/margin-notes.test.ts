import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const course = {
  title: "Test Course",
  subtitle: "A course for tests.",
  parts: [{ title: "03 Thinking in Scale", topics: [{ key: "caching", title: "Caching" }] }],
  tangents: [{ key: "herds", title: "Thundering Herds" }],
};

const note = (body: string) => `---\nstage: seedling\ntopic: course/caching\n---\n${body}\n`;

function build(notes: Record<string, string>, assets?: Record<string, string>) {
  const site = buildFixtureSite({ courses: { course }, notes, assets });
  expect(site.exitCode, site.stdout + site.stderr).toBe(0);
  return site;
}

test("an Obsidian footnote shows as a margin note beside its mark, and in the footnotes at the end", () => {
  const site = build({
    "Cache-aside.md": note("Reads go to the cache first.[^why] Then [[Cache-aside]] again.[^why]\n\n[^why]: Because the cache is *closer*\n    than the database."),
  });
  const html = site.page("/notes/cache-aside") ?? "";

  // The first reference: a numbered mark, then the margin note with the definition's inline HTML.
  expect(html).toMatch(
    /<sup class="note-mark"><a href="#note-1" id="note-ref-1"[^>]*>1<\/a><span class="mark-wide" aria-hidden="true">1<\/span><\/sup><span class="sidenote" role="note"><span class="sidenote-mark">1<\/span> Because the cache is <em>closer<\/em> than the database\.<\/span>/,
  );
  // A repeat reference is a mark only.
  expect(html.match(/class="sidenote"/g)).toHaveLength(1);
  expect(html.match(/href="#note-1"/g)).toHaveLength(2);
  // The definition itself is not left in the body.
  expect(html).not.toContain("[^why]");
  // The end-of-Note list carries it with a back link.
  expect(html).toMatch(/<li id="note-1"[^>]*>[\s\S]*?Because the cache is <em>closer<\/em>[\s\S]*?href="#note-ref-1"/);
});

test("inline ^[footnotes] are numbered in reading order with the others", () => {
  const site = build({
    "Cache-aside.md": note("First.^[An inline aside.] Second.[^b] Third.^[Another aside.]\n\n[^b]: A defined note."),
  });
  const html = site.page("/notes/cache-aside") ?? "";

  const marks = [...html.matchAll(/<span class="sidenote-mark">(\d+)<\/span> ([^<]+)<\/span>/g)].map((m) => [m[1], m[2]]);
  expect(marks).toEqual([
    ["1", "An inline aside."],
    ["2", "A defined note."],
    ["3", "Another aside."],
  ]);
});

test("a footnote reference with no definition stays as written", () => {
  const site = build({ "Cache-aside.md": note("Dangling[^missing] reference.") });
  const html = site.page("/notes/cache-aside") ?? "";
  expect(html).toContain("Dangling[^missing] reference.");
  expect(html).not.toContain('class="sidenote"');
  expect(html).not.toContain('class="footnotes"');
});

test("footnote syntax inside a code block is left alone", () => {
  const site = build({ "Cache-aside.md": note("```\n[^x]: not a footnote\n```\n\nText.") });
  const html = site.page("/notes/cache-aside") ?? "";
  expect(html).toContain('<span class="line">[^x]: not a footnote</span>');
});

test("a Tangent's first mention puts it in the margin, with its Stage", () => {
  const site = build({
    "Cache-aside.md": note("Misses stampede: [[Thundering herd]]. Again [[Thundering herd]]."),
    "Thundering herd.md": "---\nstage: budding\ntopic: course/herds\n---\nBody.\n",
  });
  const html = site.page("/notes/cache-aside") ?? "";

  expect(html).toMatch(
    /🐇1<\/span><\/sup><span class="sidenote" role="note"><span class="sidenote-mark">🐇1<\/span> Tangent: <a href="\/notes\/thundering-herd">Thundering herd<\/a> <a href="\/about-stages" class="stage-badge stage-budding"><span aria-hidden="true">🌿<\/span> Budding<\/a><\/span>/,
  );
  expect(html.match(/class="sidenote"/g)).toHaveLength(1);
});

test("a Note with three or more sections gets a Contents linking to each numbered heading", () => {
  const site = build({
    "Cache-aside.md": note("Intro.\n\n## The idea\n\nA.\n\n### A detail\n\nB.\n\n## Reads\n\nC.\n\n## Writes & *misses*\n\nD."),
  });
  const html = site.page("/notes/cache-aside") ?? "";

  expect(html).toContain('<nav class="contents" aria-labelledby="contents-head"');
  for (const id of ["the-idea", "a-detail", "reads", "writes-misses"]) {
    expect(html).toMatch(new RegExp(`<h[23] id="${id}">`));
    expect(html).toContain(`href="#${id}"`);
  }
  const rows = [...html.matchAll(/<span class="contents-number"[^>]*>([^<]*)<\/span>\s*<span class="contents-label"[^>]*>([^<]*)<\/span>/g)].map(
    (m) => `${m[1]} ${m[2]}`,
  );
  expect(rows).toEqual(["1 The idea", "1.1 A detail", "2 Reads", "3 Writes &amp; misses"]);
});

test("a Note with fewer than three sections has no Contents", () => {
  const site = build({ "Cache-aside.md": note("## One\n\nA.\n\n## Two\n\nB.") });
  expect(site.page("/notes/cache-aside")).not.toContain('class="contents"');
});

test("repeated headings get distinct ids", () => {
  const site = build({ "Cache-aside.md": note("## Notes\n\nA.\n\n## Notes\n\nB.") });
  const html = site.page("/notes/cache-aside") ?? "";
  expect(html).toContain('<h2 id="notes">');
  expect(html).toContain('<h2 id="notes-2">');
});

test("a Diagram on its own line is a framed, numbered figure named after its file", () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>';
  const site = build(
    { "Cache-aside.md": note("Before.\n\n![[osi-layers.excalidraw.svg]]\n\nInline ![[dot.svg]] here.\n\n![[second_one.svg|How the layers stack]]\n\n![[dot.svg|300]]") },
    { "osi-layers.excalidraw.svg": svg, "dot.svg": svg, "second_one.svg": svg },
  );
  const html = site.page("/notes/cache-aside") ?? "";

  expect(html).toContain(
    '<figure class="diagram"><div class="figure-frame" tabindex="0" role="group" aria-label="Figure 1" data-fig="Fig. 1" data-name="osi layers"><svg',
  );
  expect(html).toContain('<figcaption><span class="sc">Figure 1</span></figcaption>');
  expect(html).toContain('data-fig="Fig. 2" data-name="second one"');
  // Words after | caption the figure; a size alias does not.
  expect(html).toContain('<figcaption><span class="sc">Figure 2</span>&ensp;How the layers stack</figcaption>');
  expect(html).toContain('<figcaption><span class="sc">Figure 3</span></figcaption>');
  // A Diagram inside a sentence stays inline and unframed.
  expect(html).toMatch(/Inline <span class="diagram"><svg/);
  expect(html).not.toMatch(/<p>\s*<figure/);
});

test("a margin note called from a table cell is set just after the table", () => {
  const site = build({
    "Cache-aside.md": note("| Layer | Unit |\n|---|---|\n| Transport | segment[^seg] |\n\n[^seg]: TCP's word; UDP says datagram."),
  });
  const html = site.page("/notes/cache-aside") ?? "";
  const table = html.slice(html.indexOf("<table>"), html.indexOf("</table>"));
  expect(table).toContain('href="#note-1"');
  expect(table).not.toContain('class="sidenote"');
  expect(html).toMatch(/<\/table>\s*<p class="table-notes"><span class="sidenote" role="note"><span class="sidenote-mark">1<\/span> TCP&#39;s word; UDP says datagram\.<\/span><\/p>/);
});
