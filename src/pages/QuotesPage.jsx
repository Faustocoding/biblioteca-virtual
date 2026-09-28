import { useMemo, useState } from 'react'
import { QuoteCard } from '../components/quotes/QuoteCard'
import { useAllQuotes } from '../hooks/useAllQuotes'

export function QuotesPage({ onOpenBook }) {
  const { quotes, loading, error, remove } = useAllQuotes()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return quotes
    return quotes.filter((quote) => {
      const book = quote.books
      return (
        quote.text.toLowerCase().includes(q) ||
        book?.title?.toLowerCase().includes(q) ||
        book?.author?.toLowerCase().includes(q)
      )
    })
  }, [quotes, query])

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Citas favoritas {quotes.length > 0 && `(${quotes.length})`}
      </h2>

      {quotes.length > 0 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en tus citas..."
          className="mb-3 w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
      )}

      {loading && <p className="text-sm text-zinc-400">Cargando...</p>}
      {error && (
        <p className="text-sm text-red-500">
          No se pudieron cargar las citas. Revisá tu conexión con Supabase.
        </p>
      )}
      {!loading && !error && quotes.length === 0 && (
        <p className="text-sm text-zinc-400">
          Todavía no guardaste ninguna cita. Agregalas desde la ficha de cualquier libro.
        </p>
      )}
      {!loading && !error && quotes.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-zinc-400">Ninguna cita coincide con tu búsqueda.</p>
      )}

      <ul className="flex flex-col gap-2">
        {filtered.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} onOpenBook={onOpenBook} onRemove={remove} />
        ))}
      </ul>
    </div>
  )
}
