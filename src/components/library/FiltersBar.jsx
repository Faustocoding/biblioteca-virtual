import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'to_read', label: 'Próximo a leer' },
  { value: 'reading', label: 'Leyendo' },
  { value: 'read', label: 'Leído' },
]

const RATING_OPTIONS = [
  { value: '', label: 'Cualquier rating' },
  { value: '5', label: '★★★★★' },
  { value: '4', label: '★★★★' },
  { value: '3', label: '★★★' },
  { value: '2', label: '★★' },
  { value: '1', label: '★' },
]

const selectClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900'

export function FiltersBar({ filters, onChange, categories, authors }) {
  const [open, setOpen] = useState(false)

  const activeCount = ['status', 'category', 'rating', 'author'].filter((k) => filters[k]).length

  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  function clearAll() {
    onChange({ query: filters.query, status: '', category: '', rating: '', author: '' })
  }

  return (
    <div className="mb-3">
      <div className="flex gap-2">
        <input
          type="search"
          value={filters.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder="Buscar en tu biblioteca (título o autor)..."
          className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`relative flex-none rounded-full border px-3 py-2 text-sm ${
            open
              ? 'border-violet-500 text-violet-600 dark:text-violet-400'
              : 'border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400'
          }`}
        >
          Filtros
          {activeCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <select
            value={filters.status}
            onChange={(e) => set('status', e.target.value)}
            className={selectClass}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={filters.rating}
            onChange={(e) => set('rating', e.target.value)}
            className={selectClass}
          >
            {RATING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => set('category', e.target.value)}
            className={selectClass}
          >
            <option value="">Toda categoría</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.author}
            onChange={(e) => set('author', e.target.value)}
            className={selectClass}
          >
            <option value="">Todo autor</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="col-span-2 mt-1 text-xs text-violet-600 hover:underline dark:text-violet-400"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
