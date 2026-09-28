export function QuoteCard({ quote, onOpenBook, onRemove }) {
  const book = quote.books

  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">
        “{quote.text}”
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        {book ? (
          <button
            type="button"
            onClick={() => onOpenBook(book.id)}
            className="flex min-w-0 items-center gap-2 text-left"
          >
            <div className="h-9 w-6 flex-none overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
              {book.cover_url && (
                <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {book.title}
              </p>
              <p className="truncate text-[11px] text-zinc-400">
                {book.author}
                {quote.page ? ` · pág. ${quote.page}` : ''}
              </p>
            </div>
          </button>
        ) : (
          <span className="text-xs text-zinc-400">Libro eliminado</span>
        )}

        <button
          type="button"
          onClick={() => onRemove(quote.id)}
          className="flex-none text-xs text-red-500 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}
