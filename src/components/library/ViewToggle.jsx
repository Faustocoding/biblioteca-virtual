export function ViewToggle({ value, onChange }) {
  return (
    <div className="flex flex-none gap-0.5 rounded-full border border-zinc-300 p-0.5 dark:border-zinc-700">
      <button
        type="button"
        onClick={() => onChange('shelf')}
        aria-label="Vista estantería"
        aria-pressed={value === 'shelf'}
        className={`rounded-full px-2.5 py-1 text-sm ${
          value === 'shelf'
            ? 'bg-violet-600 text-white'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        ▦
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-label="Vista lista"
        aria-pressed={value === 'list'}
        className={`rounded-full px-2.5 py-1 text-sm ${
          value === 'list'
            ? 'bg-violet-600 text-white'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        ☰
      </button>
    </div>
  )
}
