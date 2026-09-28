import { currentMonthKey, currentYear, shiftMonthKey, toMonthKey } from './dates'

export function getReadBooks(books) {
  return books.filter((b) => b.status === 'read')
}

export function booksReadByYear(books, year) {
  return getReadBooks(books).filter(
    (b) => b.finished_at && Number(b.finished_at.slice(0, 4)) === year,
  )
}

export function booksReadByMonth(books, year) {
  const counts = Array(12).fill(0)
  booksReadByYear(books, year).forEach((b) => {
    const monthIndex = Number(b.finished_at.slice(5, 7)) - 1
    if (monthIndex >= 0 && monthIndex < 12) counts[monthIndex] += 1
  })
  return counts
}

export function totalPagesRead(books) {
  const readPages = getReadBooks(books).reduce((sum, b) => sum + (b.total_pages ?? 0), 0)
  const readingPages = books
    .filter((b) => b.status === 'reading')
    .reduce((sum, b) => sum + (b.current_page ?? 0), 0)
  return readPages + readingPages
}

export function mostFrequent(items) {
  const counts = new Map()
  items.forEach((item) => {
    if (!item) return
    counts.set(item, (counts.get(item) ?? 0) + 1)
  })
  let best = null
  let bestCount = 0
  for (const [item, count] of counts) {
    if (count > bestCount) {
      best = item
      bestCount = count
    }
  }
  return best
}

export function mostReadAuthor(books) {
  return mostFrequent(getReadBooks(books).map((b) => b.author))
}

export function mostReadGenre(books) {
  return mostFrequent(getReadBooks(books).map((b) => b.category))
}

export function averageRating(books) {
  const rated = getReadBooks(books).filter((b) => typeof b.rating === 'number' && b.rating > 0)
  if (rated.length === 0) return null
  const sum = rated.reduce((acc, b) => acc + b.rating, 0)
  return sum / rated.length
}

export function genreBreakdown(books) {
  const counts = new Map()
  getReadBooks(books).forEach((b) => {
    const genre = b.category?.trim() || 'Sin categoría'
    counts.set(genre, (counts.get(genre) ?? 0) + 1)
  })
  return [...counts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
}

export function readingStreakMonths(books) {
  const monthsWithBooks = new Set(
    getReadBooks(books)
      .map((b) => toMonthKey(b.finished_at))
      .filter(Boolean),
  )

  if (monthsWithBooks.size === 0) return 0

  let cursor = currentMonthKey()
  if (!monthsWithBooks.has(cursor)) {
    const previous = shiftMonthKey(cursor, -1)
    if (!monthsWithBooks.has(previous)) return 0
    cursor = previous
  }

  let streak = 0
  while (monthsWithBooks.has(cursor)) {
    streak += 1
    cursor = shiftMonthKey(cursor, -1)
  }
  return streak
}

export function booksReadThisYear(books) {
  return booksReadByYear(books, currentYear()).length
}
