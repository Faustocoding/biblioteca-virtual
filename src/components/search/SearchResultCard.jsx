export function SearchResultCard({ result, alreadyAdded, adding, onAdd }) {
  return (
    <li className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-20 w-14 flex-none overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
        {result.coverUrl ? (
          <img
            src={result.coverUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
            Sin portada
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {result.title}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{result.author}</p>
          {result.year && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{result.year}</p>
          )}
        </div>

        <button
          type="button"
          disabled={alreadyAdded || adding}
          onClick={() => onAdd(result)}
          className="mt-1 self-start rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
        >
          {alreadyAdded ? 'En tu biblioteca' : adding ? 'Agregando...' : '+ Agregar'}
        </button>
      </div>
    </li>
  )
}
