import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

test("/about-stages explains the three Stages, Recall and Demotion", () => {
  const build = buildGarden();

  expect(build.exitCode, build.stdout + build.stderr).toBe(0);
  const html = build.page("/about-stages") ?? "";
  for (const term of ["🌱 Seedling", "🌿 Budding", "🌳 Evergreen", "Recall", "Demotion"]) {
    expect(html).toContain(term);
  }
});
