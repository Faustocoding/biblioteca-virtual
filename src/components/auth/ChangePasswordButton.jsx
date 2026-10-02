import { useState } from 'react'
import { useAuthContext } from '../../context/AuthProvider'

export function ChangePasswordButton() {
  const { setPassword } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [password, setPasswordInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | saving | done | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) return

    setStatus('saving')
    try {
      await setPassword(password)
      setStatus('done')
      setPasswordInput('')
      setTimeout(() => {
        setStatus('idle')
        setOpen(false)
      }, 1200)
    } catch {
      setStatus('error')
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Cambiar contraseña"
        title="Cambiar contraseña"
        className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
      >
        🔑
      </button>
    )
  }

  return (
    <div className="absolute right-0 top-9 z-50 w-60 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Nueva contraseña
        </label>
        <input
          type="password"
          autoFocus
          minLength={6}
          required
          value={password}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="flex-1 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            {status === 'saving' ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Cancelar
          </button>
        </div>
        {status === 'done' && <p className="text-center text-xs text-green-600">Listo ✓</p>}
        {status === 'error' && (
          <p className="text-center text-xs text-red-500">No se pudo guardar. Probá de nuevo.</p>
        )}
      </form>
    </div>
  )
}
