import { create } from 'zustand'
import type { RecordModel } from 'pocketbase'
import { pb } from '../lib/pocketbase'
import { pullRemoteProgress } from '../lib/syncProgress'
import { useProgressStore } from './useProgressStore'

interface AuthState {
  user: RecordModel | null
  loading: boolean
  error: string | null
  init: () => void
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: pb.authStore.record,
  loading: false,
  error: null,

  init: () => {
    pb.authStore.onChange((_token, record) => {
      set({ user: record })
    })
    if (pb.authStore.isValid) {
      void pullRemoteProgress().then((remote) => {
        if (remote) useProgressStore.getState().hydrateFromRemote(remote)
      })
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      await pb.collection('users').authWithPassword(email, password)
      const remote = await pullRemoteProgress()
      if (remote) useProgressStore.getState().hydrateFromRemote(remote)
      set({ loading: false })
      return true
    } catch (err) {
      set({ loading: false, error: friendlyAuthError(err) })
      return false
    }
  },

  signup: async (email, password, name) => {
    set({ loading: true, error: null })
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password, name })
      await pb.collection('users').authWithPassword(email, password)
      set({ loading: false })
      return true
    } catch (err) {
      set({ loading: false, error: friendlyAuthError(err) })
      return false
    }
  },

  logout: () => {
    pb.authStore.clear()
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))

function friendlyAuthError(err: unknown): string {
  if (err && typeof err === 'object' && 'status' in err) {
    const status = (err as { status: number }).status
    if (status === 0) return 'Сервер PocketBase недоступен. Прогресс сохраняется локально.'
    if (status === 400) return 'Неверный email или пароль.'
  }
  return 'Что-то пошло не так. Попробуйте ещё раз.'
}
