import { useEffect, useState } from 'react'
import { findSimilarBooks } from '../../lib/bookSearch'
import { SearchResultCard } from '../search/SearchResultCard'

export function RecommendedBooks({ book, existingBooks, onAddBook }) {
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('loading') // loading | idle | error
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    findSimilarBooks({
      author: book.author,
      category: book.category,
      excludeSource: book.source_api,
      excludeId: book.source_id,
    })
      .then((found) => {
        if (cancelled) return
        setResults(found)
        setStatus('idle')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [book.id, book.author, book.category, book.source_api, book.source_id])

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

  if (status === 'loading') {
    return <p className="text-sm text-zinc-400">Buscando recomendaciones...</p>
  }

  if (status === 'error' || results.length === 0) {
    return (
      <p className="text-sm text-zinc-400">
        No encontramos sugerencias parecidas por ahora.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {results.slice(0, 4).map((result) => (
        <SearchResultCard
          key={`${result.source}-${result.sourceId}`}
          result={result}
          alreadyAdded={isAlreadyAdded(result)}
          adding={addingId === result.sourceId}
          onAdd={handleAdd}
        />
      ))}
    </ul>
  )
}
