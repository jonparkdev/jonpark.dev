import { defineConfig } from "astro/config";
import { gardenInputs } from "./src/garden/inputs";

// Fail fast, naming the path, if the notes folder, assets folder or Curriculum is missing.
gardenInputs();

export default defineConfig({
  site: "https://jonpark.dev",
  output: "static",
  // Inline page CSS: one small site, so no extra stylesheet request per page.
  build: { inlineStylesheets: "always" },
});
