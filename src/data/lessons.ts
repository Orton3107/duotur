import type { ModuleId, Word } from './types'
import { wordsByModule } from './modules'

export const WORDS_PER_LESSON = 8

export interface Lesson {
  moduleId: ModuleId
  index: number
  words: Word[]
}

const lessonCache = new Map<ModuleId, Lesson[]>()

export function getLessons(moduleId: ModuleId): Lesson[] {
  const cached = lessonCache.get(moduleId)
  if (cached) return cached

  const words = wordsByModule[moduleId]
  const lessons: Lesson[] = []
  for (let i = 0; i < words.length; i += WORDS_PER_LESSON) {
    lessons.push({
      moduleId,
      index: lessons.length,
      words: words.slice(i, i + WORDS_PER_LESSON),
    })
  }
  lessonCache.set(moduleId, lessons)
  return lessons
}

export function getLesson(moduleId: ModuleId, index: number): Lesson | undefined {
  return getLessons(moduleId)[index]
}

/** Words already introduced up to (and including) a given lesson — used to pick MCQ distractors and cumulative review. */
export function getWordsUpTo(moduleId: ModuleId, lessonIndex: number): Word[] {
  const lessons = getLessons(moduleId)
  return lessons.slice(0, lessonIndex + 1).flatMap((l) => l.words)
}
