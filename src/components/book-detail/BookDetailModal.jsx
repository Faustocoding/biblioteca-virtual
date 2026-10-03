import { useState } from 'react'
import { useQuotes } from '../../hooks/useQuotes'
import { fetchBookDescription } from '../../lib/bookSearch'
import { CategorySelect } from '../common/CategorySelect'
import { ProgressBar } from './ProgressBar'
import { QuotesList } from './QuotesList'
import { RatingStars } from './RatingStars'
import { RecommendedBooks } from './RecommendedBooks'
import { StatusSelector } from './StatusSelector'

export function BookDetailModal({ book, categories, existingBooks, onClose, onUpdate, onAddBook }) {
  const { quotes, loading: quotesLoading, create, remove } = useQuotes(book.id)
  const [review, setReview] = useState(book.review ?? '')
  const [coverUrl, setCoverUrl] = useState(book.cover_url ?? '')
  const [editingCover, setEditingCover] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState(book.description ?? null)
  const [summaryStatus, setSummaryStatus] = useState(book.description ? 'ready' : 'idle')

  function saveReview() {
    if (review !== (book.review ?? '')) onUpdate({ review: review.trim() || null })
  }

  function saveCoverUrl() {
    if (coverUrl !== (book.cover_url ?? '')) onUpdate({ cover_url: coverUrl.trim() || null })
    setEditingCover(false)
  }

  async function handleToggleSummary() {
    const opening = !showSummary
    setShowSummary(opening)
    if (!opening || summaryStatus !== 'idle') return

    setSummaryStatus('loading')
    const desc = await fetchBookDescription({ source: book.source_api, sourceId: book.source_id })
    if (desc) {
      setSummary(desc)
      setSummaryStatus('ready')
      onUpdate({ description: desc })
    } else {
      setSummaryStatus('unavailable')
    }
  }

  async function handleShare() {
    const shareText = `${book.title} — ${book.author}`

    if (navigator.share) {
      try {
        await navigator.share({ title: book.title, text: shareText })
      } catch {
        // el usuario canceló el share sheet, no hacemos nada
      }
      return
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // no se pudo copiar, no hacemos nada
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="flex max-h-[92svh] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl bg-white p-4 dark:bg-zinc-950 sm:rounded-2xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="h-24 w-16 flex-none overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
            {book.cover_url && (
              <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {book.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{book.author}</p>
          </div>
          <div className="relative flex flex-none items-center gap-1">
            <button
              type="button"
              onClick={handleToggleSummary}
              aria-label="Ver resumen"
              title="Ver resumen"
              className="rounded-full p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ℹ️
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartir"
              className="rounded-full p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              📤
            </button>
            {copied && (
              <span className="absolute -bottom-5 right-0 whitespace-nowrap rounded bg-zinc-900 px-2 py-0.5 text-[10px] text-white dark:bg-zinc-100 dark:text-zinc-900">
                Copiado
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="rounded-full p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ✕
            </button>
          </div>
        </div>

        {showSummary && (
          <div className="mb-4 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
            {summaryStatus === 'loading' && (
              <p className="text-sm text-zinc-400">Buscando resumen...</p>
            )}
            {summaryStatus === 'unavailable' && (
              <p className="text-sm text-zinc-400">No hay resumen disponible para este libro.</p>
            )}
            {summaryStatus === 'ready' && summary && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {summary}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <StatusSelector value={book.status} onChange={(status) => onUpdate({ status })} />

          {book.status === 'reading' && (
            <ProgressBar
              currentPage={book.current_page}
              totalPages={book.total_pages}
              onChangeCurrentPage={(current_page) => onUpdate({ current_page })}
              onChangeTotalPages={(total_pages) => onUpdate({ total_pages })}
            />
          )}

          {book.status === 'read' && (
            <div className="flex items-center justify-between gap-3">
              <RatingStars value={book.rating} onChange={(rating) => onUpdate({ rating })} />
              <input
                type="date"
                value={book.finished_at ?? ''}
                onChange={(e) => onUpdate({ finished_at: e.target.value || null })}
                className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          )}

          {editingCover ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Portada (link de imagen)
              </label>
              <input
                type="url"
                inputMode="url"
                autoFocus
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                onBlur={saveCoverUrl}
                placeholder="https://..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Pegá el link de una imagen para usarla como portada.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingCover(true)}
              className="w-fit text-xs text-violet-600 hover:underline dark:text-violet-400"
            >
              {book.cover_url ? 'Cambiar portada' : 'Agregar portada (link)'}
            </button>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Categoría / género
            </label>
            <CategorySelect
              categories={categories}
              value={book.category}
              onChange={(value) => onUpdate({ category: value || null })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Reseña / comentario personal
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              onBlur={saveReview}
              rows={3}
              placeholder="¿Qué te pareció?"
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Citas y notas
            </h3>
            <QuotesList quotes={quotes} loading={quotesLoading} onAdd={create} onRemove={remove} />
          </div>

          {book.status === 'read' && (
            <div>
              <h3 className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Porque leíste esto, te puede gustar
              </h3>
              <RecommendedBooks book={book} existingBooks={existingBooks} onAddBook={onAddBook} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
