import { useState } from 'react'

const EMPTY_FORM = { title: '', author: '', category: '', totalPages: '', coverUrl: '' }

export function ManualAddBookForm({ categories, onAddBook }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function close() {
    setOpen(false)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const title = form.title.trim()
    const author = form.author.trim()
    if (!title || !author) return

    setSubmitting(true)
    try {
      await onAddBook({
        title,
        author,
        category: form.category.trim() || null,
        totalPages: form.totalPages ? Number(form.totalPages) : null,
        coverUrl: form.coverUrl.trim() || null,
        source: 'manual',
        sourceId: null,
      })
      close()
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-sm text-violet-600 hover:underline dark:text-violet-400"
      >
        ¿No lo encontrás? Agregalo manualmente
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex flex-col gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Título *
        </label>
        <input
          type="text"
          required
          autoFocus
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Autor *
        </label>
        <input
          type="text"
          required
          value={form.author}
          onChange={(e) => updateField('author', e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Categoría / género
        </label>
        <input
          list="manual-add-category-options"
          type="text"
          value={form.category}
          onChange={(e) => updateField('category', e.target.value)}
          placeholder="Ej: Ciencia ficción"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <datalist id="manual-add-category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Páginas totales
        </label>
        <input
          type="number"
          min="0"
          value={form.totalPages}
          onChange={(e) => updateField('totalPages', e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Portada (link de imagen, opcional)
        </label>
        <input
          type="url"
          inputMode="url"
          value={form.coverUrl}
          onChange={(e) => updateField('coverUrl', e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={close}
          disabled={submitting}
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || !form.title.trim() || !form.author.trim()}
          className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'Agregando...' : 'Agregar libro'}
        </button>
      </div>
    </form>
  )
}
