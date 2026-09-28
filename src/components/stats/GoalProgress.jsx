import { useState } from 'react'

export function GoalProgress({ goal, booksThisYear, year, onSetTarget }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(goal?.target ?? 24)

  async function handleSubmit(e) {
    e.preventDefault()
    const target = Number(value)
    if (!target || target <= 0) return
    await onSetTarget(target)
    setEditing(false)
  }

  if (!goal && !editing) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-center dark:border-zinc-700">
        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
          Todavía no definiste una meta de lectura para {year}.
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          Definir meta
        </button>
      </div>
    )
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
      >
        <label className="text-sm text-zinc-500 dark:text-zinc-400">Meta {year}:</label>
        <input
          type="number"
          min="1"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">libros</span>
        <button
          type="submit"
          className="ml-auto rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          Cancelar
        </button>
      </form>
    )
  }

  const target = goal.target
  const pct = target > 0 ? Math.min(100, Math.round((booksThisYear / target) * 100)) : 0

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Llevás {booksThisYear} de {target} libros este {year}
        </p>
        <button
          type="button"
          onClick={() => {
            setValue(target)
            setEditing(true)
          }}
          className="text-xs text-violet-600 hover:underline dark:text-violet-400"
        >
          Editar
        </button>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-violet-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-zinc-400">{pct}%</p>
    </div>
  )
}
