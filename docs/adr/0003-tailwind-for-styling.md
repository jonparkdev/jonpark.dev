# Pages are styled with Tailwind utilities; Markdown output is styled in one stylesheet

Pages, layouts and components are styled with Tailwind CSS v4 utility classes in their markup, with no `<style>` blocks. `src/styles/global.css` is the only stylesheet. It holds the design tokens (`@theme`: the article's inks, the Garden Modern fonts, a closed type scale, the measure, the gutter and a single `sm` breakpoint at 36rem), the `@font-face` rules, element defaults (`@layer base`), and the rules for HTML rendered from Markdown (`@layer components`: `.article-body`, `.note-body`). That HTML comes from `src/garden/markdown.ts`, so there is no markup to put utilities on. Its rules are written with `@apply` wherever a utility exists. Raw declarations remain only for CSS counters and generated `content`.

Where a CSS feature has no utility, we use Tailwind's own escape hatches rather than a `<style>` block. Small caps are a custom `@utility small-caps`. Counters use arbitrary properties (`[counter-increment:ref]`). Generated content uses `before:`/`after:` with `content-[…]`, and the ladder's narrow-column layout uses the built-in `@container/ladder` variants.

## Considered Options

- **`@tailwindcss/typography` (`prose`) for Note bodies**: its defaults would have to be overridden almost everywhere to get back to the LaTeX article look, and it adds a dependency.
- **Descendant variants on the body wrapper (`[&_h2]:…`)**: purely utilities, but around 60 hard-to-read arbitrary classes on one element.

## Consequences

- Tailwind scans `src/` only (`@import "tailwindcss" source("../")`). The Obsidian vault's plugin bundles would otherwise produce unused utilities. Class names must appear whole in source, never assembled at runtime, or the scanner won't find them.
- The site's one stylesheet is still inlined into every page (`build.inlineStylesheets: "always"`), so each page carries the CSS for the whole site, about 22 KB raw and 6 KB gzipped.
- Hooks that tests or the Markdown renderer depend on (`stage-badge stage-<stage>`, `wikilink`, `unwritten`, `tangent-mark`, `listing`, `line`, `diagram`, `links-to`, `linked-from`) stay as plain class names alongside the utilities.
