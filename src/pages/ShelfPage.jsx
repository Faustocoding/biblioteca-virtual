import { useMemo, useState } from 'react'
import { BookListTable } from '../components/library/BookListTable'
import { FiltersBar } from '../components/library/FiltersBar'
import { BookCard } from '../components/library/BookCard'
import { ViewToggle } from '../components/library/ViewToggle'
import { BookSearchBar } from '../components/search/BookSearchBar'
import { ManualAddBookForm } from '../components/search/ManualAddBookForm'
import { useBooksContext } from '../context/BooksProvider'
import { useViewMode } from '../hooks/useViewMode'

const EMPTY_FILTERS = { query: '', status: '', category: '', rating: '', author: '' }

export function ShelfPage({ onOpenBook }) {
  const { books, loading, error, addBook, editBook } = useBooksContext()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [view, setView] = useViewMode()

  const categories = useMemo(
    () => [...new Set(books.map((b) => b.category).filter(Boolean))].sort(),
    [books],
  )
  const authors = useMemo(
    () => [...new Set(books.map((b) => b.author).filter(Boolean))].sort(),
    [books],
  )

  const filteredBooks = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return books.filter((b) => {
      if (filters.status && b.status !== filters.status) return false
      if (filters.category && b.category !== filters.category) return false
      if (filters.author && b.author !== filters.author) return false
      if (filters.rating && b.rating !== Number(filters.rating)) return false
      if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }, [books, filters])

  const hasActiveFilters =
    filters.query || filters.status || filters.category || filters.rating || filters.author

  return (
    <div>
      <BookSearchBar existingBooks={books} onAddBook={addBook} />
      <ManualAddBookForm categories={categories} onAddBook={addBook} />

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Tu biblioteca {books.length > 0 && `(${books.length})`}
          </h2>
          {books.length > 0 && <ViewToggle value={view} onChange={setView} />}
        </div>

        {books.length > 0 && (
          <FiltersBar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            authors={authors}
          />
        )}

        {loading && <p className="text-sm text-zinc-400">Cargando...</p>}
        {error && (
          <p className="text-sm text-red-500">
            No se pudo conectar con Supabase. Revisá tu configuración en .env.local.
          </p>
        )}
        {!loading && !error && books.length === 0 && (
          <p className="text-sm text-zinc-400">
            Todavía no agregaste ningún libro. Usá el buscador de arriba.
          </p>
        )}
        {!loading && !error && books.length > 0 && filteredBooks.length === 0 && (
          <p className="text-sm text-zinc-400">
            Ningún libro coincide con {hasActiveFilters ? 'estos filtros' : 'la búsqueda'}.
          </p>
        )}

        {view === 'shelf' ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => onOpenBook(book.id)}
                onUpdate={(patch) => editBook(book.id, patch)}
              />
            ))}
          </div>
        ) : (
          <BookListTable books={filteredBooks} onOpenBook={onOpenBook} />
        )}
      </section>
    </div>
  )
}
