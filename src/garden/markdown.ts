import { Marked, type TokenizerAndRendererExtension } from "marked";

/** What rendering a Note body needs to know about the rest of the garden. */
export interface RenderContext {
  /** The page path of the Note a wikilink target names, or undefined if it isn't written yet. */
  resolveNote(target: string): string | undefined;
}

const WIKILINK = /^\[\[([^\[\]|#]*)(?:#[^\[\]|]*)?(?:\|([^\[\]]*))?\]\]/;

/**
 * Renders a Note body to HTML, resolving wikilinks through the context.
 */
export function renderMarkdown(markdown: string, context: RenderContext): string {
  const wikilink: TokenizerAndRendererExtension = {
    name: "wikilink",
    level: "inline",
    start: (src) => src.indexOf("[["),
    tokenizer(src) {
      const match = WIKILINK.exec(src);
      if (!match) return undefined;
      const target = match[1].trim();
      return { type: "wikilink", raw: match[0], target, label: match[2]?.trim() || target };
    },
    renderer(token) {
      const href = context.resolveNote(token.target);
      const label = escapeHtml(token.label);
      if (href) return `<a class="wikilink" href="${escapeHtml(href)}">${label}</a>`;
      // Links ahead of the writing are allowed; show them as not-yet-written ideas.
      return `<span class="wikilink unwritten" title="Not written yet">${label}</span>`;
    },
  };
  return new Marked({ gfm: true, async: false, extensions: [wikilink] }).parse(markdown) as string;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
