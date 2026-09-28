import { useCallback, useEffect, useState } from 'react'
import {
  addBookFromSearchResult,
  deleteBook,
  fetchBooks,
  reorderToReadBooks,
  updateBook,
} from '../api/books'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchBooks()
      setBooks(data)
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

  const addBook = useCallback(async (searchResult) => {
    const created = await addBookFromSearchResult(searchResult)
    setBooks((prev) => [created, ...prev])
    return created
  }, [])

  const editBook = useCallback(async (id, patch) => {
    const updated = await updateBook(id, patch)
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)))
    return updated
  }, [])

  const removeBook = useCallback(async (id) => {
    await deleteBook(id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  // orderedIds: ids de los libros "to_read" en el nuevo orden deseado.
  const reorderToRead = useCallback(
    async (orderedIds) => {
      const orderMap = new Map(orderedIds.map((id, index) => [id, index]))
      setBooks((prev) =>
        prev.map((b) => (orderMap.has(b.id) ? { ...b, sort_order: orderMap.get(b.id) } : b)),
      )
      try {
        await reorderToReadBooks(orderedIds)
      } catch (err) {
        await refresh()
        throw err
      }
    },
    [refresh],
  )

  return { books, loading, error, refresh, addBook, editBook, removeBook, reorderToRead }
}
