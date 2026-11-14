import type { Curriculum, Part, Topic } from "./curriculum";
import type { Note } from "./garden";

/** One Topic on the Topic index, with its Notes. */
export interface TopicEntry {
  topic: Topic;
  /** The Topic's Notes, ordered by title. Never empty. */
  notes: Note[];
}

/** One Part on the Topic index: only its Topics that have Notes, in Curriculum order. */
export interface PartEntry {
  part: Part;
  topics: TopicEntry[];
}

/**
 * The Topic index: the Curriculum's Parts and Topics in order, keeping only
 * Topics with at least one Note, and only Parts with such a Topic. Tangents
 * last. `notes` must be ordered by title; each Topic keeps that order.
 */
export function topicIndex(curriculum: Curriculum, notes: Note[]): PartEntry[] {
  const byTopic = Map.groupBy(notes, (note) => note.topic.key);
  return curriculum.parts
    .map((part) => ({
      part,
      topics: part.topics.flatMap((topic) => {
        const topicNotes = byTopic.get(topic.key);
        return topicNotes ? [{ topic, notes: topicNotes }] : [];
      }),
    }))
    .filter((entry) => entry.topics.length > 0);
}
