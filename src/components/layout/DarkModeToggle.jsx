import { useDarkMode } from '../../hooks/useDarkMode'

export function DarkModeToggle() {
  const { theme, toggle } = useDarkMode()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema"
      className="rounded-full border border-zinc-300 p-2 text-sm dark:border-zinc-700"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
