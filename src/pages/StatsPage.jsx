import { StatsDashboard } from '../components/stats/StatsDashboard'
import { useBooksContext } from '../context/BooksProvider'

export function StatsPage() {
  const { books } = useBooksContext()

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Estadísticas</h2>
      <StatsDashboard books={books} />
    </div>
  )
}
