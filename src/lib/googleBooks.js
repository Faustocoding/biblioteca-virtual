const VOLUMES_URL = 'https://www.googleapis.com/books/v1/volumes'

export async function searchGoogleBooks(query, { limit = 20 } = {}) {
  const url = new URL(VOLUMES_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('maxResults', String(Math.min(limit, 40)))

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Google Books respondió ${res.status}`)
  const data = await res.json()

  return (data.items ?? []).map((item) => {
    const info = item.volumeInfo ?? {}
    return {
      source: 'googlebooks',
      sourceId: item.id,
      title: info.title ?? 'Sin título',
      author: info.authors?.[0] ?? 'Autor desconocido',
      coverUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
      year: info.publishedDate ? Number(info.publishedDate.slice(0, 4)) : null,
      totalPages: info.pageCount ?? null,
      category: info.categories?.[0] ?? null,
      description: info.description ?? null,
    }
  })
}

export async function fetchGoogleBooksDescription(id) {
  const res = await fetch(`${VOLUMES_URL}/${id}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.volumeInfo?.description ?? null
}

export async function searchGoogleBooksByAuthorOrSubject({ author, subject, excludeId, limit = 6 }) {
  const url = new URL(VOLUMES_URL)
  const q = subject ? `subject:"${subject}"` : `inauthor:"${author}"`
  url.searchParams.set('q', q)
  url.searchParams.set('maxResults', String(limit + 1))

  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()

  return (data.items ?? [])
    .filter((item) => item.id !== excludeId)
    .slice(0, limit)
    .map((item) => {
      const info = item.volumeInfo ?? {}
      return {
        source: 'googlebooks',
        sourceId: item.id,
        title: info.title ?? 'Sin título',
        author: info.authors?.[0] ?? 'Autor desconocido',
        coverUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
      }
    })
}
