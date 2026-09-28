import { useCallback, useEffect, useState } from 'react'
import { addQuote, deleteQuote, fetchQuotesByBook } from '../api/quotes'

export function useQuotes(bookId) {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!bookId) return
    setLoading(true)
    try {
      setQuotes(await fetchQuotesByBook(bookId))
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const create = useCallback(
    async (input) => {
      const created = await addQuote(bookId, input)
      setQuotes((prev) => [created, ...prev])
      return created
    },
    [bookId],
  )

  const remove = useCallback(async (id) => {
    await deleteQuote(id)
    setQuotes((prev) => prev.filter((q) => q.id !== id))
  }, [])

  return { quotes, loading, create, remove }
}
