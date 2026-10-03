const SEARCH_URL = 'https://openlibrary.org/search.json'

function coverUrl(coverId, size = 'M') {
  if (!coverId) return null
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}

export async function searchOpenLibrary(query, { limit = 20 } = {}) {
  const url = new URL(SEARCH_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set(
    'fields',
    'key,title,author_name,cover_i,first_publish_year,number_of_pages_median,subject',
  )

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open Library respondió ${res.status}`)
  const data = await res.json()

  return (data.docs ?? []).map((doc) => ({
    source: 'openlibrary',
    sourceId: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? 'Autor desconocido',
    coverUrl: coverUrl(doc.cover_i),
    year: doc.first_publish_year ?? null,
    totalPages: doc.number_of_pages_median ?? null,
    category: doc.subject?.[0] ?? null,
  }))
}

export async function fetchOpenLibraryDescription(workKey) {
  if (!workKey) return null
  const res = await fetch(`https://openlibrary.org${workKey}.json`)
  if (!res.ok) return null
  const data = await res.json()
  const desc = data.description
  if (!desc) return null
  return typeof desc === 'string' ? desc : (desc.value ?? null)
}

export async function searchOpenLibraryByAuthorOrSubject({ author, subject, excludeKey, limit = 6 }) {
  const url = new URL(SEARCH_URL)
  const q = subject ? `subject:"${subject}"` : `author:"${author}"`
  url.searchParams.set('q', q)
  url.searchParams.set('limit', String(limit + 1))
  url.searchParams.set('fields', 'key,title,author_name,cover_i')

  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()

  return (data.docs ?? [])
    .filter((doc) => doc.key !== excludeKey)
    .slice(0, limit)
    .map((doc) => ({
      source: 'openlibrary',
      sourceId: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] ?? 'Autor desconocido',
      coverUrl: coverUrl(doc.cover_i),
    }))
}
