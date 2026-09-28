import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Estantería', icon: '📚', end: true },
  { to: '/to-read', label: 'Próximos', icon: '📝' },
  { to: '/stats', label: 'Estadísticas', icon: '📊' },
  { to: '/quotes', label: 'Citas', icon: '💬' },
]

export function NavBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div
        className="mx-auto flex max-w-2xl justify-around px-2 pt-1.5"
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[11px] font-medium ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
