import PocketBase from 'pocketbase'

const url = import.meta.env.VITE_POCKETBASE_URL ?? 'http://127.0.0.1:8090'

export const pb = new PocketBase(url)
// Auth store persists to localStorage automatically and survives reloads.
pb.autoCancellation(false)

export function isLoggedIn(): boolean {
  return pb.authStore.isValid
}

export function currentUserId(): string | null {
  return pb.authStore.record?.id ?? null
}

/** True once we've confirmed the PocketBase server actually answers requests. */
export async function isBackendReachable(): Promise<boolean> {
  try {
    await pb.health.check()
    return true
  } catch {
    return false
  }
}
