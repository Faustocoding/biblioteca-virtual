export function StreakBadge({ months }) {
  if (!months) return null

  return (
    <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
      <span>🔥</span>
      <span>
        {months} {months === 1 ? 'mes seguido' : 'meses seguidos'} leyendo
      </span>
    </div>
  )
}
