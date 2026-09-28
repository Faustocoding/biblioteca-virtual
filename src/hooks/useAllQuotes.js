import { useCallback, useEffect, useState } from 'react'
import { deleteQuote, fetchAllQuotes } from '../api/quotes'

export function useAllQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setQuotes(await fetchAllQuotes())
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const remove = useCallback(async (id) => {
    await deleteQuote(id)
    setQuotes((prev) => prev.filter((q) => q.id !== id))
  }, [])

  return { quotes, loading, error, refresh, remove }
}
