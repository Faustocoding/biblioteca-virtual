import { useEffect, useRef, useState } from 'react'
import { searchBooks } from '../../lib/bookSearch'
import { SearchResultCard } from './SearchResultCard'

const DEBOUNCE_MS = 400

export function BookSearchBar({ existingBooks, onAddBook }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [addingId, setAddingId] = useState(null)
  const debounceRef = useRef(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = query.trim()
    if (trimmed.length < 3) {
      setResults([])
      setStatus('idle')
      return
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current
      setStatus('loading')
      try {
        const found = await searchBooks(trimmed)
        if (requestId !== requestIdRef.current) return
        setResults(found)
        setStatus('idle')
      } catch {
        if (requestId !== requestIdRef.current) return
        setStatus('error')
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  function isAlreadyAdded(result) {
    return existingBooks.some(
      (b) => b.source_api === result.source && b.source_id === result.sourceId,
    )
  }

  async function handleAdd(result) {
    setAddingId(result.sourceId)
    try {
      await onAddBook(result)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="w-full">
      <input
        type="search"
        inputMode="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por título o autor..."
        className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />

      {status === 'loading' && (
        <p className="mt-2 text-center text-sm text-zinc-400">Buscando...</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-center text-sm text-red-500">
          No se pudo buscar. Probá de nuevo en un momento.
        </p>
      )}
      {status === 'idle' && query.trim().length >= 3 && results.length === 0 && (
        <p className="mt-2 text-center text-sm text-zinc-400">Sin resultados.</p>
      )}

      {results.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {results.map((result) => (
            <SearchResultCard
              key={`${result.source}-${result.sourceId}`}
              result={result}
              alreadyAdded={isAlreadyAdded(result)}
              adding={addingId === result.sourceId}
              onAdd={handleAdd}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
