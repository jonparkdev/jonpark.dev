import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const astroBin = join(projectRoot, "node_modules/.bin/astro");

/** A small garden for one test: Notes and Diagrams by filename, plus a Curriculum. */
export interface FixtureGarden {
  /** Note filename (e.g. "Consistent hashing.md") to file contents. */
  notes?: Record<string, string>;
  /** Asset filename (e.g. "ring.svg") to file contents. */
  assets?: Record<string, string>;
  /** Curriculum, written as JSON. Shape is defined by the site's Curriculum module. */
  curriculum?: unknown;
}

export interface GardenBuild {
  /** Temp directory holding the fixture garden and the built site. */
  root: string;
  /** Where the fixture's notes folder was written. */
  notesDir: string;
  /** Where the fixture's assets folder was written. */
  assetsDir: string;
  /** Where the fixture's Curriculum was written. */
  curriculumPath: string;
  /** Static output directory. */
  outDir: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  /**
   * HTML of a built page by URL path ("/", "/notes/foo"), or undefined if it
   * was not generated.
   */
  page(urlPath: string): string | undefined;
}

export interface BuildOptions {
  /** Extra environment for the build, applied last (e.g. to point an input somewhere else). */
  env?: Record<string, string>;
}

/** Writes a fixture garden into a temp dir and runs the real site build against it. */
export function buildGarden(garden: FixtureGarden = {}, options: BuildOptions = {}): GardenBuild {
  const root = mkdtempSync(join(tmpdir(), "garden-"));
  const notesDir = join(root, "notes");
  const assetsDir = join(root, "assets");
  const curriculumPath = join(root, "curriculum.json");
  const outDir = join(root, "dist");

  writeFiles(notesDir, garden.notes ?? {});
  writeFiles(assetsDir, garden.assets ?? {});
  writeFileSync(curriculumPath, JSON.stringify(garden.curriculum ?? { parts: [] }, null, 2));

  const result = spawnSync(astroBin, ["build", "--outDir", outDir], {
    cwd: projectRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      GARDEN_NOTES_DIR: notesDir,
      GARDEN_ASSETS_DIR: assetsDir,
      GARDEN_CURRICULUM: curriculumPath,
      NO_COLOR: "1",
      ...options.env,
    },
  });

  return {
    root,
    notesDir,
    assetsDir,
    curriculumPath,
    outDir,
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    page(urlPath) {
      const file = join(outDir, urlPath.replace(/^\/+|\/+$/g, ""), "index.html");
      return existsSync(file) ? readFileSync(file, "utf8") : undefined;
    },
  };
}

function writeFiles(dir: string, files: Record<string, string>) {
  mkdirSync(dir, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    writeFileSync(join(dir, name), contents);
  }
}
