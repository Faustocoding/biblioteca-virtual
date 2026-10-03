import { useEffect, useState } from 'react'
import { fetchBookDescription } from '../../lib/bookSearch'

export function BookDescriptionModal({ book, onClose, onUpdate }) {
  const [description, setDescription] = useState(book.description ?? null)
  const [status, setStatus] = useState(book.description ? 'ready' : 'loading')

  useEffect(() => {
    if (book.description) {
      setDescription(book.description)
      setStatus('ready')
      return
    }

    if (!book.source_api || !book.source_id) {
      setStatus('unavailable')
      return
    }

    let cancelled = false
    setStatus('loading')

    fetchBookDescription({ source: book.source_api, sourceId: book.source_id }).then((desc) => {
      if (cancelled) return
      if (desc) {
        setDescription(desc)
        setStatus('ready')
        onUpdate?.({ description: desc })
      } else {
        setStatus('unavailable')
      }
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80svh] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl bg-white p-4 dark:bg-zinc-950 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {book.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{book.author}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex-none rounded-full p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>

        {status === 'loading' && (
          <p className="text-sm text-zinc-400">Buscando resumen...</p>
        )}
        {status === 'unavailable' && (
          <p className="text-sm text-zinc-400">No hay resumen disponible para este libro.</p>
        )}
        {status === 'ready' && description && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
