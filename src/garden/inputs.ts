import { existsSync } from "node:fs";
import { resolve } from "node:path";

/** Where the build reads the garden from. */
export interface GardenInputs {
  /** Folder of Notes (flat, one Markdown file per Note). */
  notesDir: string;
  /** Folder of Diagrams and other embedded assets. */
  assetsDir: string;
  /** JSON file holding the Curriculum. */
  curriculumPath: string;
}

/**
 * Resolves the build's inputs. Each can be overridden by an environment
 * variable (used by tests to build a fixture garden); the defaults point at
 * the real vault. Relative paths resolve against the project root (the
 * build's working directory). Throws, naming the path, if an input is missing.
 */
export function gardenInputs(env: NodeJS.ProcessEnv = process.env): GardenInputs {
  const inputs = {
    notesDir: resolve(env.GARDEN_NOTES_DIR ?? "garden/notes"),
    assetsDir: resolve(env.GARDEN_ASSETS_DIR ?? "garden/assets"),
    curriculumPath: resolve(env.GARDEN_CURRICULUM ?? "src/curriculum.json"),
  };
  for (const path of Object.values(inputs)) {
    if (!existsSync(path)) throw new Error(`Garden input not found: ${path}`);
  }
  return inputs;
}
