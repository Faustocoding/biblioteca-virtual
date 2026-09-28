import { useReadingGoal } from '../../hooks/useReadingGoal'
import { currentYear } from '../../utils/dates'
import {
  averageRating,
  booksReadByMonth,
  booksReadThisYear,
  genreBreakdown,
  getReadBooks,
  mostReadAuthor,
  mostReadGenre,
  readingStreakMonths,
  totalPagesRead,
} from '../../utils/stats'
import { BooksPerMonthChart } from './charts/BooksPerMonthChart'
import { GenreBreakdownChart } from './charts/GenreBreakdownChart'
import { GoalProgress } from './GoalProgress'
import { StreakBadge } from './StreakBadge'

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  )
}

export function StatsDashboard({ books }) {
  const year = currentYear()
  const { goal, setTarget } = useReadingGoal(year)

  const readBooks = getReadBooks(books)

  if (readBooks.length === 0) {
    return (
      <p className="text-sm text-zinc-400">
        Todavía no marcaste ningún libro como "Leído". Cuando lo hagas vas a ver tus estadísticas
        acá.
      </p>
    )
  }

  const avgRating = averageRating(books)
  const streak = readingStreakMonths(books)
  const genres = genreBreakdown(books)
  const monthlyCounts = booksReadByMonth(books, year)
  const thisYearCount = booksReadThisYear(books)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Libros leídos" value={readBooks.length} />
        <StatCard label="Páginas leídas" value={totalPagesRead(books)} />
        <StatCard label="Rating promedio" value={avgRating ? avgRating.toFixed(1) : '—'} />
        <StatCard label="Autor favorito" value={mostReadAuthor(books) ?? '—'} />
        <StatCard label="Género favorito" value={mostReadGenre(books) ?? '—'} />
        <StatCard label={`Libros en ${year}`} value={thisYearCount} />
      </div>

      <GoalProgress goal={goal} booksThisYear={thisYearCount} year={year} onSetTarget={setTarget} />

      <StreakBadge months={streak} />

      <div>
        <h3 className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Libros leídos por mes ({year})
        </h3>
        <BooksPerMonthChart counts={monthlyCounts} />
      </div>

      {genres.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Géneros más leídos
          </h3>
          <GenreBreakdownChart data={genres} />
        </div>
      )}
    </div>
  )
}
