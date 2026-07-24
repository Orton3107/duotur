import type { ModuleId, Word } from './types'
import { wordsByModule } from './modules'

/** Small chunks for true beginners: fewer new words per sitting, more repetition per word. */
export const WORDS_PER_LESSON = 5
/** After this many new-content lessons, insert a cumulative review of everything learned so far. */
const LESSONS_PER_REVIEW = 4
/** Review lessons resample a subset of previously learned words rather than testing all of them. */
const REVIEW_SAMPLE_SIZE = 10
/** Avoid a lonely 1-2 word trailing lesson — fold it into the previous chunk instead. */
const MIN_LAST_LESSON_SIZE = 3

export interface Lesson {
  moduleId: ModuleId
  index: number
  words: Word[]
}

export interface PathItem {
  moduleId: ModuleId
  /** Position within the combined lesson+review path — used in the URL and for sequential unlocking. */
  pathIndex: number
  type: 'lesson' | 'review'
  /** For 'lesson': its index into getLessons(). For 'review': the last lesson index it covers. */
  lessonIndex: number
}

const lessonCache = new Map<ModuleId, Lesson[]>()
const pathCache = new Map<ModuleId, PathItem[]>()

export function getLessons(moduleId: ModuleId): Lesson[] {
  const cached = lessonCache.get(moduleId)
  if (cached) return cached

  const words = wordsByModule[moduleId]
  const chunks: Word[][] = []
  for (let i = 0; i < words.length; i += WORDS_PER_LESSON) {
    chunks.push(words.slice(i, i + WORDS_PER_LESSON))
  }
  if (chunks.length > 1 && chunks[chunks.length - 1].length < MIN_LAST_LESSON_SIZE) {
    const last = chunks.pop()!
    chunks[chunks.length - 1] = [...chunks[chunks.length - 1], ...last]
  }

  const lessons: Lesson[] = chunks.map((chunkWords, index) => ({ moduleId, index, words: chunkWords }))
  lessonCache.set(moduleId, lessons)
  return lessons
}

export function getLesson(moduleId: ModuleId, index: number): Lesson | undefined {
  return getLessons(moduleId)[index]
}

/** Words already introduced up to (and including) a given lesson — used to pick MCQ distractors and for review sampling. */
export function getWordsUpTo(moduleId: ModuleId, lessonIndex: number): Word[] {
  const lessons = getLessons(moduleId)
  return lessons.slice(0, lessonIndex + 1).flatMap((l) => l.words)
}

/** The combined, orderable path of lesson + periodic review nodes shown on the module screen. */
export function getModulePath(moduleId: ModuleId): PathItem[] {
  const cached = pathCache.get(moduleId)
  if (cached) return cached

  const lessons = getLessons(moduleId)
  const items: PathItem[] = []
  let sinceReview = 0

  lessons.forEach((lesson) => {
    items.push({ moduleId, pathIndex: items.length, type: 'lesson', lessonIndex: lesson.index })
    sinceReview++
    if (sinceReview === LESSONS_PER_REVIEW) {
      items.push({ moduleId, pathIndex: items.length, type: 'review', lessonIndex: lesson.index })
      sinceReview = 0
    }
  })
  if (sinceReview > 1) {
    items.push({ moduleId, pathIndex: items.length, type: 'review', lessonIndex: lessons.length - 1 })
  }

  pathCache.set(moduleId, items)
  return items
}

export function getPathItem(moduleId: ModuleId, pathIndex: number): PathItem | undefined {
  return getModulePath(moduleId)[pathIndex]
}

/** A random sample of everything learned up to (and including) `lessonIndex`, for a review session. */
export function sampleReviewWords(moduleId: ModuleId, lessonIndex: number): Word[] {
  const learned = getWordsUpTo(moduleId, lessonIndex)
  const shuffled = [...learned].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(REVIEW_SAMPLE_SIZE, learned.length))
}
