# Curriculum source

`src/curriculum.json` follows Hello Interview's System Design Course in its published order. It was checked against the source on 2026-11-12.

## Source

- Primary: the course sidebar at https://www.hellointerview.com/learn/courses/system-design
  The course has 3 Parts (Fundamentals, The Patterns, Put It All Together) made of 12 numbered modules. Each module is a Part on the Progress map.
- Not used: the wider "Learn System Design" sidebar (76 pages, e.g. https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction). Pages that are only there can become Tangents.
- Left out: quizzes, video reviews and "Live Practice (beta)" items, and the other tracks (DSA, Behavioral, ML System Design, Low Level Design).

## Decisions

- The author chose the course over the full sidebar, with the 12 modules as Parts (2026-11-12).
- "Common Patterns" sits at the start of The Patterns, outside any module, so it opens module 04 Scaling Reads.
- Keys are kebab-case and unique. They are usually Hello Interview's URL slug, with a readable name where the slug is opaque.
- 🐇 Tangents is empty and comes last.

Totals: 12 Parts with 42 Topics, plus Tangents.
