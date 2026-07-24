import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Учёба', icon: '🏠' },
  { to: '/profile', label: 'Профиль', icon: '👤' },
]

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 flex border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-white/10 dark:bg-[#131f24]/95">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${
              isActive ? 'text-duo-green' : 'text-gray-400 dark:text-gray-500'
            }`
          }
        >
          <span className="text-2xl leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
