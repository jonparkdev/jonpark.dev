# Topic keys are namespaced by Course: `topic: <course>/<key>`

The garden can hold several Courses, each with its own Curriculum, so a Note's `topic` has to say which Course it belongs to. We chose to prefix the key with the Course's slug (`topic: hellointerview/caching`). That same slug names the Course's definition file and its page URL (`/hellointerview`). Topic keys then only have to be unique within their own Course, and a Note's frontmatter shows on its face where it belongs. A bare key, or a prefix that names no Course, fails the build. A Note without `topic` stands on its own, outside any Course.

## Considered Options

- **Bare keys, unique across every Course, with the Course inferred from the key**: frontmatter stays as it was. But two syllabi could never share an obvious key like `caching`, and nothing in a Note tells a reader which Course it belongs to.
- **A separate `course:` field**: explicit, but it adds a second field that must agree with `topic`, which goes against the zero-upkeep commitment in `PRODUCT.md`.

## Consequences

Renaming a Course's slug means editing every Note in that Course, so treat slugs like Topic keys: they never change once Notes use them.
