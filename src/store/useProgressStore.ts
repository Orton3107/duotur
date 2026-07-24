import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModuleId } from '../data/types'
import { syncLessonResult, syncProfileStats } from '../lib/syncProgress'

export const HEARTS_MAX = 5
export const HEART_REGEN_MS = 4 * 60 * 60 * 1000 // 4h per heart

export interface LessonResult {
  stars: number
  mistakes: number
  completedAt: string
}

interface ProgressState {
  xp: number
  streak: number
  lastActiveDate: string | null // YYYY-MM-DD, local
  hearts: number
  nextHeartAt: number | null
  completedLessons: Record<string, LessonResult>

  recordLessonResult: (moduleId: ModuleId, lessonIndex: number, mistakes: number) => LessonResult
  recordReviewResult: (moduleId: ModuleId, lessonIndex: number, mistakes: number) => LessonResult
  loseHeart: () => void
  regenHeartsIfDue: () => void
  hydrateFromRemote: (data: Partial<Pick<ProgressState, 'xp' | 'streak' | 'lastActiveDate' | 'completedLessons'>>) => void
  resetLocalProgress: () => void
}

function todayLocal(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00')
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  )
}

function starsFor(mistakes: number): number {
  if (mistakes === 0) return 3
  if (mistakes <= 2) return 2
  return 1
}

function applyResult(
  get: () => ProgressState,
  set: (partial: Partial<ProgressState>) => void,
  key: string,
  mistakes: number,
): LessonResult {
  const stars = starsFor(mistakes)
  const state = get()
  const existing = state.completedLessons[key]
  const isFirstTime = !existing
  const xpGain = isFirstTime ? 10 + (stars === 3 ? 5 : stars === 2 ? 2 : 0) : 5

  const today = todayLocal()
  let streak = state.streak
  if (state.lastActiveDate !== today) {
    streak = state.lastActiveDate && isYesterday(state.lastActiveDate) ? state.streak + 1 : 1
  }

  const result: LessonResult = {
    stars: Math.max(stars, existing?.stars ?? 0),
    mistakes,
    completedAt: new Date().toISOString(),
  }

  set({
    xp: state.xp + xpGain,
    streak,
    lastActiveDate: today,
    completedLessons: { ...state.completedLessons, [key]: result },
  })

  return result
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      hearts: HEARTS_MAX,
      nextHeartAt: null,
      completedLessons: {},

      recordLessonResult: (moduleId, lessonIndex, mistakes) => {
        const key = `${moduleId}:${lessonIndex}`
        const result = applyResult(get, set, key, mistakes)
        void syncLessonResult(moduleId, lessonIndex, result)
        void syncProfileStats({ xp: get().xp, streak: get().streak })
        return result
      },

      recordReviewResult: (moduleId, lessonIndex, mistakes) => {
        const key = `${moduleId}:review:${lessonIndex}`
        const result = applyResult(get, set, key, mistakes)
        void syncProfileStats({ xp: get().xp, streak: get().streak })
        return result
      },

      loseHeart: () => {
        const state = get()
        if (state.hearts <= 0) return
        const hearts = state.hearts - 1
        set({
          hearts,
          nextHeartAt: state.nextHeartAt ?? Date.now() + HEART_REGEN_MS,
        })
      },

      regenHeartsIfDue: () => {
        const state = get()
        if (state.hearts >= HEARTS_MAX || state.nextHeartAt === null) return
        let hearts = state.hearts
        let nextHeartAt: number | null = state.nextHeartAt
        const now = Date.now()
        while (hearts < HEARTS_MAX && nextHeartAt !== null && now >= nextHeartAt) {
          hearts += 1
          nextHeartAt = hearts < HEARTS_MAX ? nextHeartAt + HEART_REGEN_MS : null
        }
        if (hearts !== state.hearts) set({ hearts, nextHeartAt })
      },

      hydrateFromRemote: (data) => {
        const state = get()
        set({
          xp: Math.max(state.xp, data.xp ?? 0),
          streak: Math.max(state.streak, data.streak ?? 0),
          lastActiveDate:
            !state.lastActiveDate || (data.lastActiveDate && data.lastActiveDate > state.lastActiveDate)
              ? data.lastActiveDate ?? state.lastActiveDate
              : state.lastActiveDate,
          completedLessons: { ...data.completedLessons, ...state.completedLessons },
        })
      },

      resetLocalProgress: () =>
        set({ xp: 0, streak: 0, lastActiveDate: null, hearts: HEARTS_MAX, nextHeartAt: null, completedLessons: {} }),
    }),
    { name: 'turkceyol-progress' },
  ),
)
