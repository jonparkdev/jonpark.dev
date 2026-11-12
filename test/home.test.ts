import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

test("home page shows a placeholder", () => {
  const build = buildGarden();

  expect(build.exitCode, build.stderr).toBe(0);
  expect(build.page("/")).toContain("jonpark.dev");
  expect(build.page("/")).toContain("A garden of system design notes is growing here.");
});
