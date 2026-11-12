# Curriculum source

`src/curriculum.json` lists Hello Interview's "Learn System Design" Parts and Topics in their published order. It was checked against the source on 2026-11-12.

## Source

- Primary: the "Learn System Design" sidebar. It is the same on every `/learn/system-design/*` page, for example
  https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction
  Each sidebar section is a Part.
- Not used: the structured course at https://www.hellointerview.com/learn/courses/system-design. It groups about 35 of the pages into 3 Parts and 12 pattern modules. The Topic keys would work with that grouping too.
- Left out: other tracks (DSA, Behavioral, ML System Design, Low Level Design), "Vote For New Content", and the In the Wild "All Posts" index.

## Decisions (defaults, pending author review)

- All 7 sidebar sections are kept as Parts, including the "In a Hurry" overview pages and the "In the Wild" posts. The In the Wild set is the one most likely to change.
- Premium (🔒) pages are kept, but the 🔒 marker isn't part of the display titles.
- Keys are kebab-case and unique. They are usually Hello Interview's URL slug, with a readable name where the slug is opaque or would collide (e.g. `local-delivery-service` for `gopuff`, `price-tracking-service` for `camelcamelcamel`, `youtube-top-k` for `top-k`, and `*-overview` for the In a Hurry summaries of other Parts).
- 🐇 Tangents is empty and comes last.

Totals: 7 Parts with 76 Topics (In a Hurry 7, Core Concepts 9, Question Breakdowns 32, Patterns 7, Key Technologies 10, Advanced Topics 5, In the Wild 6), plus Tangents.
