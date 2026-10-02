import { lazy, Suspense, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ChangePasswordButton } from './components/auth/ChangePasswordButton'
import { LoginScreen } from './components/auth/LoginScreen'
import { BookDetailModal } from './components/book-detail/BookDetailModal'
import { DarkModeToggle } from './components/layout/DarkModeToggle'
import { NavBar } from './components/layout/NavBar'
import { SignOutButton } from './components/layout/SignOutButton'
import { AuthProvider, useAuthContext } from './context/AuthProvider'
import { BooksProvider, useBooksContext } from './context/BooksProvider'
import { QuotesPage } from './pages/QuotesPage'
import { ShelfPage } from './pages/ShelfPage'
import { ToReadPage } from './pages/ToReadPage'

const StatsPage = lazy(() => import('./pages/StatsPage').then((m) => ({ default: m.StatsPage })))

function AppShell() {
  const { books, editBook, addBook } = useBooksContext()
  const [selectedBookId, setSelectedBookId] = useState(null)

  const selectedBook = books.find((b) => b.id === selectedBookId) ?? null

  const categories = useMemo(
    () => [...new Set(books.map((b) => b.category).filter(Boolean))].sort(),
    [books],
  )

  return (
    <>
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col px-4 pb-20 pt-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Mi Biblioteca
          </h1>
          <div className="relative flex items-center gap-1">
            <DarkModeToggle />
            <ChangePasswordButton />
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ShelfPage onOpenBook={setSelectedBookId} />} />
            <Route path="/to-read" element={<ToReadPage onOpenBook={setSelectedBookId} />} />
            <Route
              path="/stats"
              element={
                <Suspense
                  fallback={<p className="text-sm text-zinc-400">Cargando estadísticas...</p>}
                >
                  <StatsPage />
                </Suspense>
              }
            />
            <Route path="/quotes" element={<QuotesPage onOpenBook={setSelectedBookId} />} />
          </Routes>
        </main>
      </div>

      <NavBar />

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          categories={categories}
          existingBooks={books}
          onClose={() => setSelectedBookId(null)}
          onUpdate={(patch) => editBook(selectedBook.id, patch)}
          onAddBook={addBook}
        />
      )}
    </>
  )
}

function AuthGate() {
  const { session, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-zinc-400">Cargando...</p>
      </div>
    )
  }

  if (!session) {
    return <LoginScreen />
  }

  return (
    <BooksProvider>
      <AppShell />
    </BooksProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
