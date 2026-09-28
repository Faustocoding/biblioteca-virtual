import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function SortableToReadRow({ book, index, onOpenBook }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: book.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="w-5 flex-none text-center text-xs font-medium text-zinc-400">
        {index + 1}
      </span>

      <button
        type="button"
        onClick={() => onOpenBook(book.id)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="h-16 w-11 flex-none overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
          {book.cover_url && (
            <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {book.title}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{book.author}</p>
        </div>
      </button>

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastrar para reordenar"
        className="flex-none touch-none px-2 py-3 text-lg leading-none text-zinc-400 active:cursor-grabbing"
      >
        ⠿
      </button>
    </li>
  )
}
