import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

const course = (title: string) => ({ title, subtitle: "A course for tests.", parts: [] });

/** The site header's nav. */
function nav(html: string): string {
  const start = html.indexOf('<nav aria-label="Site"');
  expect(start, "the site nav").toBeGreaterThanOrEqual(0);
  return html.slice(start, html.indexOf("</nav>", start));
}

test("every page's header has a Courses dropdown listing each Course by title, then About Stages", () => {
  const build = buildFixtureSite({
    courses: { hellointerview: course("Hello Interview"), ddia: course("Designing Data-Intensive Applications") },
    notes: { "On stoicism.md": "---\nstage: seedling\n---\nBody\n" },
  });

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  for (const path of ["/", "/hellointerview", "/notes/on-stoicism", "/about-stages"]) {
    const links = nav(build.page(path) ?? "");
    expect(links, path).toMatch(/<details[^>]*>\s*<summary[^>]*>Courses<\/summary>/);
    const ddia = links.search(/<a href="\/ddia"[^>]*>Designing Data-Intensive Applications<\/a>/);
    const hi = links.search(/<a href="\/hellointerview"[^>]*>Hello Interview<\/a>/);
    const stages = links.search(/<a href="\/about-stages"[^>]*>About Stages<\/a>/);
    expect([ddia, hi, stages].every((at) => at >= 0), path).toBe(true);
    expect(ddia).toBeLessThan(hi);
    expect(hi).toBeLessThan(stages);
    expect(links, path).not.toContain(">Topics<");
  }
});
