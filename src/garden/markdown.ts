import { Marked, type Tokens, type TokenizerAndRendererExtension } from "marked";
import { slugify } from "./note-file";

/** What rendering a Note body needs to know about the rest of the garden. */
export interface RenderContext {
  /**
   * The Note a wikilink target names, or undefined if it isn't written yet:
   * its page path, and its footnote number if it is a Tangent. At a Tangent's
   * first mention, `tangentNote` is the HTML its margin note shows.
   */
  resolveNote(
    target: string,
  ): { href: string; tangentFootnote?: number; firstMention?: boolean; tangentNote?: string } | undefined;
  /** The SVG markup of the Diagram an `![[name.svg]]` embed names. */
  embedDiagram(name: string): string;
}

/** A numbered section or subsection of a Note body, for its Contents. */
export interface Heading {
  id: string;
  /** Plain text of the heading. */
  label: string;
  /** "2" for a section, "2.1" for a subsection, as the page numbers them. */
  number: string;
  depth: 2 | 3;
}

/** One of the author's own footnotes (`[^id]` or `^[text]`), shown in the margin on wide screens. */
export interface Footnote {
  n: number;
  /** The footnote's text as inline HTML. */
  html: string;
}

export interface RenderedNote {
  html: string;
  headings: Heading[];
  footnotes: Footnote[];
}

const WIKILINK = /^\[\[([^\[\]|#]*)(?:#[^\[\]|]*)?(?:\|([^\[\]]*))?\]\]/;
const DIAGRAM_EMBED = /^!\[\[([^\[\]|]*\.svg)\s*(?:\|([^\[\]]*))?\]\]/i;
/** An Obsidian embed alias that only sizes the image (`300`, `300x200`), not a caption. */
const SIZE_ALIAS = /^\s*\d+(?:\s*x\s*\d+)?\s*$/i;
const FOOTNOTE_REF = /^\[\^([^\]\s]+)\]/;
const INLINE_FOOTNOTE = /^\^\[((?:[^\[\]]|\[[^\[\]]*\])+)\]/;
const FOOTNOTE_DEF = /^\[\^([^\]\s]+)\]:[ \t]?(.*)$/;

/** Ids the Note page uses itself, which a heading must not take. */
const RESERVED_IDS = ["main", "contents-head", "links-to-head", "linked-from-head", "tangents-head", "notes-head"];

/**
 * Renders a Note body to HTML, resolving wikilinks and embedding Diagrams
 * through the context. `![[name.svg]]` embeds a Diagram, framed as a numbered
 * figure when it stands in a paragraph of its own; any other `![[target]]`
 * (such as an Obsidian Note embed) renders as the wikilink `[[target]]` would.
 * Footnotes render where they are referenced, as margin notes, and are also
 * returned for the list at the end of the Note.
 */
export function renderMarkdown(markdown: string, context: RenderContext): RenderedNote {
  const { body, definitions } = extractFootnoteDefinitions(markdown);
  const headings: Heading[] = [];
  const footnotes: Footnote[] = [];
  const footnoteNumbers = new Map<string, number>();
  const usedIds = new Set(RESERVED_IDS);
  let section = 0;
  let subsection = 0;
  let figure = 0;
  let inlineFootnotes = 0;

  const marginNote = (mark: string, html: string) =>
    `<span class="sidenote" role="note"><span class="sidenote-mark">${mark}</span> ${html}</span>`;

  const embed: TokenizerAndRendererExtension = {
    name: "embed",
    level: "inline",
    start: (src) => src.indexOf("![["),
    tokenizer(src) {
      const diagram = DIAGRAM_EMBED.exec(src);
      if (diagram) {
        const alias = diagram[2]?.trim();
        const caption = alias && !SIZE_ALIAS.test(alias) ? alias : undefined;
        return { type: "embed", raw: diagram[0], name: diagram[1].trim(), caption };
      }
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
        // The first mention carries the id the footnote's back link returns to, and the margin note.
        const id = resolved.firstMention ? ` id="tangent-ref-${n}"` : "";
        const mark = `<sup class="tangent-mark"><a href="#tangent-${n}"${id} aria-label="Tangent footnote ${n}">🐇${n}</a><span class="mark-wide" aria-hidden="true">🐇${n}</span></sup>`;
        const note = resolved.firstMention && resolved.tangentNote ? marginNote(`🐇${n}`, resolved.tangentNote) : "";
        return `${link}${mark}${note}`;
      }
      // Links ahead of the writing are allowed; show them as not-yet-written ideas.
      return `<span class="wikilink unwritten" title="Not written yet">${label}<span class="visually-hidden"> (not written yet)</span></span>`;
    },
  };
  const footnote: TokenizerAndRendererExtension = {
    name: "footnote",
    level: "inline",
    start(src) {
      const at = [src.indexOf("[^"), src.indexOf("^[")].filter((i) => i >= 0);
      return at.length > 0 ? Math.min(...at) : undefined;
    },
    tokenizer(src) {
      const ref = FOOTNOTE_REF.exec(src);
      if (ref) {
        const text = definitions.get(ref[1]);
        // A reference with no definition stays as written.
        if (text === undefined) return undefined;
        return { type: "footnote", raw: ref[0], key: `ref:${ref[1]}`, tokens: this.lexer.inlineTokens(text) };
      }
      const inline = INLINE_FOOTNOTE.exec(src);
      if (inline) {
        return { type: "footnote", raw: inline[0], key: `inline:${inlineFootnotes++}`, tokens: this.lexer.inlineTokens(inline[1]) };
      }
      return undefined;
    },
    renderer(token) {
      const repeat = footnoteNumbers.get(token.key);
      if (repeat !== undefined) return footnoteMark(repeat, false);
      const n = footnoteNumbers.size + 1;
      footnoteNumbers.set(token.key, n);
      const html = this.parser.parseInline(token.tokens ?? []);
      footnotes.push({ n, html });
      return `${footnoteMark(n, true)}${marginNote(String(n), html)}`;
    },
  };

  const html = new Marked({
    gfm: true,
    async: false,
    extensions: [embed, wikilink, footnote],
    renderer: {
      // Code blocks get one span per line so the page can number them, as LaTeX listings does.
      code({ text, lang }) {
        const lines = text.replace(/\n$/, "").split("\n");
        const language = lang ? ` data-lang="${escapeHtml(lang.split(/\s/)[0])}"` : "";
        const body = lines.map((line) => `<span class="line">${escapeHtml(line)}</span>`).join("\n");
        return `<pre class="listing"${language}><code>${body}</code></pre>\n`;
      },
      // Headings get ids, and sections and subsections are numbered for the Contents.
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const label = tokenText(tokens);
        const id = uniqueId(slugify(label) || "section", usedIds);
        if (depth === 2) {
          section += 1;
          subsection = 0;
          headings.push({ id, label, number: String(section), depth: 2 });
        } else if (depth === 3) {
          subsection += 1;
          headings.push({ id, label, number: `${section}.${subsection}`, depth: 3 });
        }
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      // A Diagram on a line of its own is a numbered figure, framed.
      paragraph({ tokens }) {
        const content = tokens.filter((t) => !(t.type === "text" && t.raw.trim() === "") && t.type !== "br");
        if (content.length === 1 && content[0].type === "embed") {
          const { name, caption } = content[0] as Tokens.Generic;
          figure += 1;
          const words = caption ? `&ensp;${escapeHtml(caption)}` : "";
          // The frame scrolls sideways on narrow screens, so it takes focus to be scrollable by keyboard.
          return (
            `<figure class="diagram">` +
            `<div class="figure-frame" tabindex="0" role="group" aria-label="Figure ${figure}" data-fig="Fig. ${figure}" data-name="${escapeHtml(diagramName(name))}">${context.embedDiagram(name)}</div>` +
            `<figcaption><span class="sc">Figure ${figure}</span>${words}</figcaption>` +
            `</figure>\n`
          );
        }
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
    },
  }).parse(body) as string;

  return { html: liftTableNotes(html), headings, footnotes };
}

/**
 * The superscript number in the text. Where the footnotes are at the end it
 * links there; where the note sits in the margin beside it, it is a plain
 * number (the page shows one or the other).
 */
function footnoteMark(n: number, first: boolean): string {
  const id = first ? ` id="note-ref-${n}"` : "";
  return `<sup class="note-mark"><a href="#note-${n}"${id} aria-label="Note ${n}">${n}</a><span class="mark-wide" aria-hidden="true">${n}</span></sup>`;
}

/**
 * A margin note inside a table cell would float over the next column, so
 * margin notes called from a table are moved to just after it.
 */
function liftTableNotes(html: string): string {
  return html.replace(/<table>[\s\S]*?<\/table>/g, (table) => {
    const notes: string[] = [];
    let rest = table;
    for (let at = rest.indexOf('<span class="sidenote"'); at >= 0; at = rest.indexOf('<span class="sidenote"')) {
      const end = closingSpan(rest, at);
      notes.push(rest.slice(at, end));
      rest = rest.slice(0, at) + rest.slice(end);
    }
    return notes.length > 0 ? `${rest}\n<p class="table-notes">${notes.join("")}</p>` : table;
  });
}

/** The index just past the `</span>` that closes the span opening at `start`. */
function closingSpan(html: string, start: number): number {
  const tag = /<span\b|<\/span>/g;
  tag.lastIndex = start;
  let depth = 0;
  for (let match = tag.exec(html); match; match = tag.exec(html)) {
    depth += match[0] === "</span>" ? -1 : 1;
    if (depth === 0) return match.index + match[0].length;
  }
  return html.length;
}

/**
 * Pulls `[^id]: text` definitions out of the Markdown (with indented
 * continuation lines), leaving fenced code alone.
 */
function extractFootnoteDefinitions(markdown: string): { body: string; definitions: Map<string, string> } {
  const definitions = new Map<string, string>();
  const kept: string[] = [];
  const lines = markdown.split("\n");
  let fence: string | undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = undefined;
      kept.push(line);
      continue;
    }
    const def = fence ? null : FOOTNOTE_DEF.exec(line);
    if (!def) {
      kept.push(line);
      continue;
    }
    const parts = [def[2]];
    while (i + 1 < lines.length && /^(?: {2,}|\t)\S/.test(lines[i + 1])) {
      i += 1;
      parts.push(lines[i].trim());
    }
    if (!definitions.has(def[1])) definitions.set(def[1], parts.join(" ").trim());
  }
  return { body: kept.join("\n"), definitions };
}

/** The Diagram's file name as its figure label: no extension, words spaced. */
function diagramName(file: string): string {
  return file
    .replace(/\.svg$/i, "")
    .replace(/\.excalidraw$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

/** The words a reader sees in these tokens, without footnotes, marks or Diagrams. */
function tokenText(tokens: Tokens.Generic[]): string {
  return tokens
    .map((token): string => {
      if (token.type === "footnote" || token.type === "embed") return "";
      if (token.type === "wikilink") return token.label as string;
      if (token.tokens) return tokenText(token.tokens);
      return typeof token.text === "string" ? token.text : "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function wikilinkToken(src: string) {
  const match = WIKILINK.exec(src);
  if (!match) return undefined;
  const target = match[1].trim();
  return { type: "wikilink", raw: match[0], target, label: match[2]?.trim() || target };
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
