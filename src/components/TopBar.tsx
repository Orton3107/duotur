import { useProgressStore } from '../store/useProgressStore'

export function TopBar() {
  const xp = useProgressStore((s) => s.xp)
  const streak = useProgressStore((s) => s.streak)
  const hearts = useProgressStore((s) => s.hearts)

  return (
    <header
      className="z-20 flex shrink-0 items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 pb-3 backdrop-blur dark:border-white/10 dark:bg-[#131f24]/90"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
    >
      <div className="text-lg font-extrabold text-duo-green">TürkçeYol</div>
      <div className="flex items-center gap-4 font-bold">
        <span className="flex items-center gap-1 text-duo-red">
          🔥 <span className="text-gray-800 dark:text-gray-100">{streak}</span>
        </span>
        <span className="flex items-center gap-1 text-duo-blue">
          💎 <span className="text-gray-800 dark:text-gray-100">{xp}</span>
        </span>
        <span className="flex items-center gap-1 text-duo-red">
          ❤️ <span className="text-gray-800 dark:text-gray-100">{hearts}</span>
        </span>
      </div>
    </header>
  )
}
