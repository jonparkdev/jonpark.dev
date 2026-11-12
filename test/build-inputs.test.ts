import { join } from "node:path";
import { expect, test } from "vitest";
import { buildGarden } from "./helpers/build-garden";

test.each(["GARDEN_NOTES_DIR", "GARDEN_ASSETS_DIR", "GARDEN_CURRICULUM"])(
  "build fails naming the missing input when %s points nowhere",
  (variable) => {
    const missing = join("/nonexistent", variable.toLowerCase());

    const build = buildGarden({}, { env: { [variable]: missing } });

    expect(build.exitCode).not.toBe(0);
    expect(build.stdout + build.stderr).toContain(missing);
  },
);
