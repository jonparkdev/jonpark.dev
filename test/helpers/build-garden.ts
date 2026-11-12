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
  /**
   * Git history for the fixture, oldest first, each commit at a controlled
   * date. With commits, the fixture root is a git repo; a Note left out of
   * every commit stays uncommitted.
   */
  commits?: FixtureCommit[];
}

export interface FixtureCommit {
  /** Author date (when the change was written), ISO 8601, e.g. "2026-03-14T12:00:00Z". */
  date: string;
  /**
   * Committer date, if it differs from the author date (as after a rebase or
   * squash-merge). Defaults to `date`.
   */
  committedDate?: string;
  /**
   * Notes to commit: filenames to commit as written in `notes`, or filename to
   * contents to write and commit first (e.g. an earlier version of a Note,
   * which a later commit of its final contents then replaces).
   */
  notes: string[] | Record<string, string>;
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
  if (garden.commits) commitHistory(root, garden.notes ?? {}, garden.commits);

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

/** Makes the fixture root a git repo and commits Notes at controlled dates. */
function commitHistory(root: string, notes: Record<string, string>, commits: FixtureCommit[]) {
  const run = (args: string[], commit?: FixtureCommit) => {
    const result = spawnSync("git", args, {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Fixture",
        GIT_AUTHOR_EMAIL: "fixture@example.com",
        GIT_COMMITTER_NAME: "Fixture",
        GIT_COMMITTER_EMAIL: "fixture@example.com",
        ...(commit
          ? { GIT_AUTHOR_DATE: commit.date, GIT_COMMITTER_DATE: commit.committedDate ?? commit.date }
          : {}),
      },
    });
    if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  };
  run(["init", "--quiet"]);
  commits.forEach((commit, i) => {
    const contents = Array.isArray(commit.notes)
      ? Object.fromEntries(commit.notes.map((name) => [name, notes[name]]))
      : commit.notes;
    for (const [name, text] of Object.entries(contents)) {
      if (text === undefined) throw new Error(`Fixture commit names "${name}", which is not in notes`);
      writeFileSync(join(root, "notes", name), text);
    }
    run(["add", "--", ...Object.keys(contents).map((name) => join("notes", name))]);
    run(["-c", "commit.gpgsign=false", "commit", "--quiet", "--allow-empty", "-m", `Commit ${i + 1}`], commit);
  });
}

function writeFiles(dir: string, files: Record<string, string>) {
  mkdirSync(dir, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    writeFileSync(join(dir, name), contents);
  }
}
