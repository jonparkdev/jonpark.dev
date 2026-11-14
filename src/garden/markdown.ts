import { Marked, type TokenizerAndRendererExtension } from "marked";

/** What rendering a Note body needs to know about the rest of the garden. */
export interface RenderContext {
  /**
   * The Note a wikilink target names, or undefined if it isn't written yet:
   * its page path, and its footnote number if it is a Tangent.
   */
  resolveNote(target: string): { href: string; tangentFootnote?: number; firstMention?: boolean } | undefined;
  /** The SVG markup of the Diagram an `![[name.svg]]` embed names. */
  embedDiagram(name: string): string;
}

const WIKILINK = /^\[\[([^\[\]|#]*)(?:#[^\[\]|]*)?(?:\|([^\[\]]*))?\]\]/;
const DIAGRAM_EMBED = /^!\[\[([^\[\]|]*\.svg)\s*(?:\|[^\[\]]*)?\]\]/i;

/**
 * Renders a Note body to HTML, resolving wikilinks and embedding Diagrams
 * through the context. `![[name.svg]]` embeds a Diagram; any other
 * `![[target]]` (such as an Obsidian Note embed) renders as the wikilink
 * `[[target]]` would.
 */
export function renderMarkdown(markdown: string, context: RenderContext): string {
  const embed: TokenizerAndRendererExtension = {
    name: "embed",
    level: "inline",
    start: (src) => src.indexOf("![["),
    tokenizer(src) {
      const diagram = DIAGRAM_EMBED.exec(src);
      if (diagram) return { type: "embed", raw: diagram[0], name: diagram[1].trim() };
      const link = wikilinkToken(src.slice(1));
      return link && { ...link, raw: `!${link.raw}` };
    },
    renderer(token) {
      return `<span class="diagram">${context.embedDiagram(token.name)}</span>`;
    },
  };
  const wikilink: TokenizerAndRendererExtension = {
    name: "wikilink",
    level: "inline",
    start: (src) => src.indexOf("[["),
    tokenizer: wikilinkToken,
    renderer(token) {
      const resolved = context.resolveNote(token.target);
      const label = escapeHtml(token.label);
      if (resolved) {
        const link = `<a class="wikilink" href="${escapeHtml(resolved.href)}">${label}</a>`;
        const n = resolved.tangentFootnote;
        if (n === undefined) return link;
        // The first mention carries the id the footnote's back link returns to.
        const id = resolved.firstMention ? ` id="tangent-ref-${n}"` : "";
        return `${link}<sup class="tangent-mark"><a href="#tangent-${n}"${id} aria-label="Tangent footnote ${n}">🐇${n}</a></sup>`;
      }
      // Links ahead of the writing are allowed; show them as not-yet-written ideas.
      return `<span class="wikilink unwritten" title="Not written yet">${label}<span class="visually-hidden"> (not written yet)</span></span>`;
    },
  };
  return new Marked({
    gfm: true,
    async: false,
    extensions: [embed, wikilink],
    renderer: {
      // Code blocks get one span per line so the page can number them, as LaTeX listings does.
      code({ text, lang }) {
        const lines = text.replace(/\n$/, "").split("\n");
        const language = lang ? ` data-lang="${escapeHtml(lang.split(/\s/)[0])}"` : "";
        const body = lines.map((line) => `<span class="line">${escapeHtml(line)}</span>`).join("\n");
        return `<pre class="listing"${language}><code>${body}</code></pre>\n`;
      },
    },
  }).parse(markdown) as string;
}

function wikilinkToken(src: string) {
  const match = WIKILINK.exec(src);
  if (!match) return undefined;
  const target = match[1].trim();
  return { type: "wikilink", raw: match[0], target, label: match[2]?.trim() || target };
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
