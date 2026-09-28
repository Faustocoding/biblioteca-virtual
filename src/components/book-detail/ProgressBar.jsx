export function ProgressBar({ currentPage, totalPages, onChangeCurrentPage, onChangeTotalPages }) {
  const pct =
    totalPages > 0 ? Math.min(100, Math.round(((currentPage ?? 0) / totalPages) * 100)) : 0

  return (
    <div>
      <div className="mb-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-violet-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <input
          type="number"
          min="0"
          value={currentPage ?? ''}
          onChange={(e) => onChangeCurrentPage(e.target.value === '' ? 0 : Number(e.target.value))}
          className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-center dark:border-zinc-700 dark:bg-zinc-900"
        />
        <span>de</span>
        <input
          type="number"
          min="0"
          value={totalPages ?? ''}
          onChange={(e) => onChangeTotalPages(e.target.value === '' ? null : Number(e.target.value))}
          placeholder="total"
          className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-center dark:border-zinc-700 dark:bg-zinc-900"
        />
        <span>páginas · {pct}%</span>
      </div>
    </div>
  )
}
