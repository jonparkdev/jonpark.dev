import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

test("/about-stages explains the three Stages, Recall and Demotion", () => {
  const build = buildFixtureSite();

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/about-stages") ?? "";
  for (const term of ["🌱 Seedling", "🌿 Budding", "🌳 Evergreen", "Recall", "Demotion"]) {
    expect(html).toContain(term);
  }
});

test("/about-stages explains Tangents, and keeps the anchors badges and links point at", () => {
  const build = buildFixtureSite();

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/about-stages") ?? "";
  expect(html).toMatch(/<h2[^>]*id="tangents"[^>]*>🐇 Tangents<\/h2>/);
  for (const id of ["seedling", "budding", "evergreen", "how-stages-change"]) {
    expect(html).toContain(`id="${id}"`);
  }
});
