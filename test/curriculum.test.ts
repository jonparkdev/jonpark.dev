import { expect, test } from "vitest";
import { buildFixtureSite } from "./helpers/build-fixture-site";

test("a Topic key defined twice in the Curriculum fails the build, naming the key", () => {
  const build = buildFixtureSite({
    curriculum: {
      parts: [{ title: "Core Concepts", topics: [{ key: "caching", title: "Caching" }] }],
      tangents: [{ key: "caching", title: "Caching again" }],
    },
  });

  expect(build.exitCode).not.toBe(0);
  expect(build.stdout + build.stderr).toContain('topic key "caching" is defined more than once');
});

test("a malformed Curriculum fails the build, naming the Curriculum file", () => {
  const build = buildFixtureSite({ curriculum: { parts: [{ topics: [] }] } });

  expect(build.exitCode).not.toBe(0);
  expect(build.stdout + build.stderr).toContain(`Curriculum ${build.curriculumPath}`);
});
