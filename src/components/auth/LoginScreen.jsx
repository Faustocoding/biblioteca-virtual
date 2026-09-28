import { useState } from 'react'
import { useAuthContext } from '../../context/AuthProvider'

export function LoginScreen() {
  const { signInWithMagicLink } = useAuthContext()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('sending')
    try {
      await signInWithMagicLink(trimmed)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="mb-1 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Mi Biblioteca
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Ingresá tu email y te mandamos un link para entrar, sin contraseña.
        </p>

        {status === 'sent' ? (
          <p className="rounded-xl border border-zinc-200 p-3 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            Te mandamos un email a <strong>{email}</strong>. Abrilo desde este mismo dispositivo
            para entrar.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              autoFocus
              inputMode="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviarme el link mágico'}
            </button>
            {status === 'error' && (
              <p className="text-center text-xs text-red-500">
                No se pudo enviar el email. Probá de nuevo.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
