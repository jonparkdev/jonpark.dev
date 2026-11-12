import type { Curriculum, Part, Topic } from "./curriculum";
import type { Note } from "./garden";
import { compareStages, STAGES, type Stage } from "./stage";

/** One Topic on the Progress map, with what the garden holds for it. */
export interface TopicProgress {
  topic: Topic;
  /** The Topic's Notes, ordered by title. */
  notes: Note[];
  /** Stage of the Topic's most advanced Note; undefined when the Topic is untouched. */
  stage: Stage | undefined;
  /** How many of the Topic's Notes sit at each Stage. */
  counts: Record<Stage, number>;
}

/** One Part on the Progress map: its Topics in Curriculum order. */
export interface PartProgress {
  part: Part;
  topics: TopicProgress[];
}

/** The Curriculum's Parts and Topics in order, each Topic with its Notes. Tangents last. */
export function progressMap(curriculum: Curriculum, notes: Note[]): PartProgress[] {
  const byTopic = new Map<string, Note[]>();
  for (const note of notes) byTopic.set(note.topic.key, [...(byTopic.get(note.topic.key) ?? []), note]);

  return curriculum.parts.map((part) => ({
    part,
    topics: part.topics.map((topic) => {
      const topicNotes = [...(byTopic.get(topic.key) ?? [])].sort((a, b) => a.title.localeCompare(b.title));
      const stage = topicNotes
        .map((note) => note.stage)
        .reduce<Stage | undefined>((best, s) => (best && compareStages(best, s) >= 0 ? best : s), undefined);
      const counts = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<Stage, number>;
      for (const note of topicNotes) counts[note.stage]++;
      return { topic, notes: topicNotes, stage, counts };
    }),
  }));
}
