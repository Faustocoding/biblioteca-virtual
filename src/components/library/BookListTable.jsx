import { RatingStars } from '../book-detail/RatingStars'

const STATUS_LABEL = {
  to_read: 'Próximo a leer',
  reading: 'Leyendo',
  read: 'Leído',
}

export function BookListTable({ books, onOpenBook }) {
  return (
    <ul className="flex flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {books.map((book) => (
        <li key={book.id}>
          <button
            type="button"
            onClick={() => onOpenBook(book.id)}
            className="flex w-full items-center gap-3 bg-white p-2 text-left dark:bg-zinc-900"
          >
            <div className="h-16 w-11 flex-none overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
              {book.cover_url && (
                <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {book.title}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{book.author}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  {STATUS_LABEL[book.status] ?? book.status}
                </span>
                {book.category && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {book.category}
                  </span>
                )}
              </div>
            </div>

            {book.status === 'read' && book.rating && (
              <RatingStars value={book.rating} readOnly size="text-xs" />
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
