import { useState } from 'react'
import { BookDescriptionModal } from './BookDescriptionModal'

const STATUS_LABEL = {
  to_read: 'Próximo a leer',
  reading: 'Leyendo',
  read: 'Leído',
}

export function BookCard({ book, onClick, onUpdate }) {
  const [showDescription, setShowDescription] = useState(false)

  function handleInfoClick(e) {
    e.stopPropagation()
    setShowDescription(true)
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
        className="flex cursor-pointer flex-col gap-1 text-left"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-200 shadow-sm dark:bg-zinc-800">
          {book.cover_url ? (
            <img src={book.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-zinc-500">
              {book.title}
            </div>
          )}
          <button
            type="button"
            onClick={handleInfoClick}
            aria-label="Ver resumen"
            title="Ver resumen"
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs text-white backdrop-blur-sm hover:bg-black/70"
          >
            ℹ️
          </button>
        </div>
        <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">{book.title}</p>
        <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{book.author}</p>
        <div className="flex flex-wrap items-center gap-1">
          <span className="w-fit rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            {STATUS_LABEL[book.status] ?? book.status}
          </span>
          {book.category && (
            <span className="w-fit truncate rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {book.category}
            </span>
          )}
        </div>
      </div>

      {showDescription && (
        <BookDescriptionModal
          book={book}
          onClose={() => setShowDescription(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
