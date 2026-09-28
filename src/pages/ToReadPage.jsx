import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useMemo, useState } from 'react'
import { SortableToReadRow } from '../components/to-read/SortableToReadRow'
import { useBooksContext } from '../context/BooksProvider'

export function ToReadPage({ onOpenBook }) {
  const { books, loading, reorderToRead } = useBooksContext()

  const toReadSorted = useMemo(
    () =>
      books
        .filter((b) => b.status === 'to_read')
        .sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER)),
    [books],
  )

  const idsKey = toReadSorted.map((b) => b.id).join(',')
  const [orderedIds, setOrderedIds] = useState(() => (idsKey ? idsKey.split(',') : []))

  useEffect(() => {
    setOrderedIds(idsKey ? idsKey.split(',') : [])
  }, [idsKey])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  const booksById = useMemo(() => new Map(toReadSorted.map((b) => [b.id, b])), [toReadSorted])
  const orderedBooks = orderedIds.map((id) => booksById.get(id)).filter(Boolean)

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setOrderedIds((prev) => {
      const oldIndex = prev.indexOf(active.id)
      const newIndex = prev.indexOf(over.id)
      const next = arrayMove(prev, oldIndex, newIndex)
      reorderToRead(next)
      return next
    })
  }

  return (
    <div>
      <h2 className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Próximos a leer {orderedBooks.length > 0 && `(${orderedBooks.length})`}
      </h2>

      {loading && <p className="text-sm text-zinc-400">Cargando...</p>}
      {!loading && orderedBooks.length === 0 && (
        <p className="text-sm text-zinc-400">No tenés libros pendientes por ahora.</p>
      )}
      {!loading && orderedBooks.length > 1 && (
        <p className="mb-3 text-xs text-zinc-400">
          Mantené presionado el ⠿ y arrastrá para priorizar qué leer primero.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {orderedBooks.map((book, index) => (
              <SortableToReadRow key={book.id} book={book} index={index} onOpenBook={onOpenBook} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
