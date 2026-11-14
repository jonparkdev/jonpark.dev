/** How well a Note is understood, from least to most advanced. */
export const STAGES = ["seedling", "budding", "evergreen"] as const;

export type Stage = (typeof STAGES)[number];

const display: Record<Stage, { emoji: string; label: string }> = {
  seedling: { emoji: "🌱", label: "Seedling" },
  budding: { emoji: "🌿", label: "Budding" },
  evergreen: { emoji: "🌳", label: "Evergreen" },
};

/** One sentence on what a Note at this Stage has been through, shown at the top of its page. */
const cue: Record<Stage, string> = {
  seedling: "Written from memory with the source closed. Not yet re-explained on a different day or checked against the source.",
  budding:
    "Re-explained from memory on a different day, then checked and corrected against the source. Not yet applied in a Mock, a design problem, or an Explainer.",
  evergreen: "Applied in a Mock, a design problem, or an Explainer. Stable, not finished.",
};

export function stageCue(stage: Stage): string {
  return cue[stage];
}

export function isStage(value: unknown): value is Stage {
  return typeof value === "string" && (STAGES as readonly string[]).includes(value);
}

export function stageEmoji(stage: Stage): string {
  return display[stage].emoji;
}

export function stageLabel(stage: Stage): string {
  return display[stage].label;
}

/** Positive if `a` is more advanced than `b`. Sorting with it puts Seedlings first. */
export function compareStages(a: Stage, b: Stage): number {
  return STAGES.indexOf(a) - STAGES.indexOf(b);
}
