/** How well a Note is understood, from least to most advanced. */
export const STAGES = ["seedling", "budding", "evergreen"] as const;

export type Stage = (typeof STAGES)[number];

const display: Record<Stage, { emoji: string; label: string }> = {
  seedling: { emoji: "🌱", label: "Seedling" },
  budding: { emoji: "🌿", label: "Budding" },
  evergreen: { emoji: "🌳", label: "Evergreen" },
};

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
