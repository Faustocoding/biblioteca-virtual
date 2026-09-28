import { createContext, useContext } from 'react'
import { useBooks } from '../hooks/useBooks'

const BooksContext = createContext(null)

export function BooksProvider({ children }) {
  const value = useBooks()
  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
}

export function useBooksContext() {
  const ctx = useContext(BooksContext)
  if (!ctx) throw new Error('useBooksContext debe usarse dentro de <BooksProvider>')
  return ctx
}
