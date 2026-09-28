import { useState } from 'react'

export function QuotesList({ quotes, loading, onAdd, onRemove }) {
  const [text, setText] = useState('')
  const [page, setPage] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    try {
      await onAdd({ text: text.trim(), page: page ? Number(page) : null })
      setText('')
      setPage('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-3 flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribí una cita o nota..."
          rows={2}
          className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            placeholder="Página (opcional)"
            className="w-32 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={saving || !text.trim()}
            className="ml-auto rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
          >
            {saving ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </form>

      {loading && <p className="text-sm text-zinc-400">Cargando citas...</p>}
      {!loading && quotes.length === 0 && (
        <p className="text-sm text-zinc-400">Todavía no hay citas guardadas de este libro.</p>
      )}

      <ul className="flex flex-col gap-2">
        {quotes.map((q) => (
          <li
            key={q.id}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">“{q.text}”</p>
            <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
              {q.page ? <span>pág. {q.page}</span> : <span />}
              <button
                type="button"
                onClick={() => onRemove(q.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
