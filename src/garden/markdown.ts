import { Marked } from "marked";

/**
 * Renders a Note body to HTML. Wikilinks and Diagram embeds (tickets 04, 05)
 * plug in here as marked extensions.
 */
export function renderMarkdown(markdown: string): string {
  return new Marked({ gfm: true, async: false }).parse(markdown) as string;
}
