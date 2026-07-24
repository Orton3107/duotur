import { useNavigate } from 'react-router-dom'
import { moduleMetas } from '../data/modules'
import { getLessons } from '../data/lessons'
import { useProgressStore } from '../store/useProgressStore'
import { useAuthStore } from '../store/useAuthStore'

export function ProfilePage() {
  const navigate = useNavigate()
  const xp = useProgressStore((s) => s.xp)
  const streak = useProgressStore((s) => s.streak)
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const totalLessons = moduleMetas.reduce((sum, m) => sum + getLessons(m.id).length, 0)
  const totalDone = Object.keys(completedLessons).length

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-duo-green text-3xl text-white">
          {user?.name?.[0]?.toUpperCase() ?? '🙂'}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 dark:text-gray-100">
            {user?.name || user?.email || 'Гость'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user ? 'Прогресс сохраняется в облаке' : 'Прогресс хранится только на этом устройстве'}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-gray-50 py-4 dark:bg-gray-800">
          <div className="text-2xl">🔥</div>
          <div className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{streak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">дней подряд</div>
        </div>
        <div className="rounded-2xl bg-gray-50 py-4 dark:bg-gray-800">
          <div className="text-2xl">💎</div>
          <div className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{xp}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">очков опыта</div>
        </div>
        <div className="rounded-2xl bg-gray-50 py-4 dark:bg-gray-800">
          <div className="text-2xl">📚</div>
          <div className="text-lg font-extrabold text-gray-800 dark:text-gray-100">
            {totalDone}/{totalLessons}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">уроков</div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        {moduleMetas.map((mod) => {
          const lessons = getLessons(mod.id)
          const done = lessons.filter((l) => completedLessons[`${mod.id}:${l.index}`]).length
          const pct = Math.round((done / lessons.length) * 100)
          return (
            <div key={mod.id}>
              <div className="mb-1 flex justify-between text-sm font-bold text-gray-600 dark:text-gray-300">
                <span>
                  {mod.emoji} {mod.title}
                </span>
                <span>
                  {done}/{lessons.length}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: mod.color }} />
              </div>
            </div>
          )
        })}
      </div>

      {user ? (
        <button
          onClick={logout}
          className="w-full rounded-2xl border-2 border-gray-200 py-3 font-extrabold text-gray-500 dark:border-gray-700 dark:text-gray-400"
        >
          Выйти
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="btn-3d w-full rounded-2xl bg-duo-blue py-3.5 font-extrabold text-white"
          style={{ ['--btn-shadow' as any]: '#1899d6' }}
        >
          Войти или создать аккаунт
        </button>
      )}
    </div>
  )
}
