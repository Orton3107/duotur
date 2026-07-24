import { pb, isLoggedIn, currentUserId } from './pocketbase'
import type { ModuleId } from '../data/types'
import type { LessonResult } from '../store/useProgressStore'

/**
 * All sync calls are fire-and-forget best-effort: the app is fully usable offline
 * (progress lives in localStorage via zustand/persist) and PocketBase is an optional
 * cloud backup/sync layer. Any network/auth failure here is swallowed on purpose.
 */

export async function syncLessonResult(moduleId: ModuleId, lessonIndex: number, result: LessonResult) {
  if (!isLoggedIn()) return
  const user = currentUserId()
  if (!user) return
  try {
    const filter = `user = "${user}" && module = "${moduleId}" && lesson_index = ${lessonIndex}`
    const existing = await pb.collection('user_progress').getFirstListItem(filter).catch(() => null)
    const payload = {
      user,
      module: moduleId,
      lesson_index: lessonIndex,
      stars: result.stars,
      mistakes: result.mistakes,
      completed_at: result.completedAt,
    }
    if (existing) {
      await pb.collection('user_progress').update(existing.id, payload)
    } else {
      await pb.collection('user_progress').create(payload)
    }
  } catch {
    // offline or backend unreachable — local progress already saved, nothing else to do
  }
}

export async function syncProfileStats(stats: { xp: number; streak: number }) {
  if (!isLoggedIn()) return
  const user = currentUserId()
  if (!user) return
  try {
    await pb.collection('users').update(user, {
      xp: stats.xp,
      streak: stats.streak,
      last_active: new Date().toISOString(),
    })
  } catch {
    // ignored — best-effort cloud sync
  }
}

export interface RemoteProgress {
  xp: number
  streak: number
  lastActiveDate: string | null
  completedLessons: Record<string, LessonResult>
}

export async function pullRemoteProgress(): Promise<RemoteProgress | null> {
  if (!isLoggedIn()) return null
  const user = currentUserId()
  if (!user) return null
  try {
    const record = pb.authStore.record
    const items = await pb.collection('user_progress').getFullList({ filter: `user = "${user}"` })
    const completedLessons: Record<string, LessonResult> = {}
    for (const item of items) {
      completedLessons[`${item.module}:${item.lesson_index}`] = {
        stars: item.stars,
        mistakes: item.mistakes,
        completedAt: item.completed_at,
      }
    }
    return {
      xp: record?.xp ?? 0,
      streak: record?.streak ?? 0,
      lastActiveDate: record?.last_active ? record.last_active.slice(0, 10) : null,
      completedLessons,
    }
  } catch {
    return null
  }
}
