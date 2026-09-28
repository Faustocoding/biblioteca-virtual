import { searchGoogleBooks, searchGoogleBooksByAuthorOrSubject } from './googleBooks'
import { searchOpenLibrary, searchOpenLibraryByAuthorOrSubject } from './openLibrary'

// Busca en Open Library primero. Si trae pocos resultados o la mayoría
// no tiene portada, completa/reemplaza con Google Books.
export async function searchBooks(query) {
  if (!query?.trim()) return []

  let openLibraryResults = []
  try {
    openLibraryResults = await searchOpenLibrary(query)
  } catch {
    openLibraryResults = []
  }

  const withCover = openLibraryResults.filter((r) => r.coverUrl)
  const needsFallback = openLibraryResults.length < 5 || withCover.length < openLibraryResults.length / 2

  if (!needsFallback) return openLibraryResults

  let googleResults = []
  try {
    googleResults = await searchGoogleBooks(query)
  } catch {
    googleResults = []
  }

  if (openLibraryResults.length === 0) return googleResults

  // Combina: prioriza resultados de Open Library, completa portadas faltantes
  // con el resultado de Google Books más parecido por título, y agrega el resto.
  const merged = openLibraryResults.map((r) => {
    if (r.coverUrl) return r
    const match = googleResults.find(
      (g) => g.title.toLowerCase() === r.title.toLowerCase(),
    )
    return match?.coverUrl ? { ...r, coverUrl: match.coverUrl } : r
  })

  const usedTitles = new Set(merged.map((r) => r.title.toLowerCase()))
  const extras = googleResults.filter((g) => !usedTitles.has(g.title.toLowerCase()))

  return [...merged, ...extras].slice(0, 20)
}

export async function findSimilarBooks({ author, category, excludeSource, excludeId }) {
  const excludeKey = excludeSource === 'openlibrary' ? excludeId : undefined
  const excludeGoogleId = excludeSource === 'googlebooks' ? excludeId : undefined

  try {
    const results = await searchOpenLibraryByAuthorOrSubject({
      author,
      subject: category,
      excludeKey,
      limit: 4,
    })
    if (results.length > 0) return results
  } catch {
    // sigue al fallback
  }

  try {
    return await searchGoogleBooksByAuthorOrSubject({
      author,
      subject: category,
      excludeId: excludeGoogleId,
      limit: 4,
    })
  } catch {
    return []
  }
}
