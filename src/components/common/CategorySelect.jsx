import { useState } from 'react'

const NEW_OPTION = '__new__'

export function CategorySelect({ categories, value, onChange, placeholder = 'Sin categoría' }) {
  const [addingNew, setAddingNew] = useState(false)
  const [newValue, setNewValue] = useState('')

  const options =
    value && !categories.includes(value) ? [...categories, value].sort() : categories

  function handleSelectChange(e) {
    const selected = e.target.value
    if (selected === NEW_OPTION) {
      setAddingNew(true)
      setNewValue('')
      return
    }
    onChange(selected)
  }

  function confirmNew() {
    const trimmed = newValue.trim()
    setAddingNew(false)
    if (trimmed) onChange(trimmed)
  }

  function cancelNew() {
    setAddingNew(false)
    setNewValue('')
  }

  if (addingNew) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          autoFocus
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              confirmNew()
            }
            if (e.key === 'Escape') cancelNew()
          }}
          onBlur={confirmNew}
          placeholder="Nueva categoría"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={cancelNew}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <select
      value={value || ''}
      onChange={handleSelectChange}
      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <option value="">{placeholder}</option>
      {options.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
      <option value={NEW_OPTION}>+ Agregar categoría nueva...</option>
    </select>
  )
}
