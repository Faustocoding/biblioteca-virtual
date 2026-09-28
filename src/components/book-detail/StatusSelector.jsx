const OPTIONS = [
  { value: 'to_read', label: 'Próximo a leer' },
  { value: 'reading', label: 'Leyendo' },
  { value: 'read', label: 'Leído' },
]

export function StatusSelector({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition ${
            value === opt.value
              ? 'bg-violet-600 text-white'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
