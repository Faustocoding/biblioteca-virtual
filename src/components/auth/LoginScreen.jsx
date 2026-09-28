import { useState } from 'react'
import { useAuthContext } from '../../context/AuthProvider'

export function LoginScreen() {
  const { signInWithMagicLink, verifyCode } = useAuthContext()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | verifying | error
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('sending')
    setError('')
    try {
      await signInWithMagicLink(trimmed)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    const trimmedCode = code.trim()
    if (!trimmedCode) return

    setStatus('verifying')
    setError('')
    try {
      await verifyCode(email.trim(), trimmedCode)
      // Si funciona, el listener de auth actualiza la sesión y esta pantalla desaparece sola.
    } catch {
      setError('Código incorrecto o vencido. Pedí uno nuevo.')
      setStatus('sent')
    }
  }

  function handleRequestAgain() {
    setStatus('idle')
    setCode('')
    setError('')
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="mb-1 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Mi Biblioteca
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Ingresá tu email y te mandamos un link (y un código) para entrar, sin contraseña.
        </p>

        {status === 'sent' || status === 'verifying' ? (
          <div className="flex flex-col gap-3">
            <p className="rounded-xl border border-zinc-200 p-3 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
              Te mandamos un email a <strong>{email}</strong>. Podés tocar el link desde este
              mismo dispositivo, o escribir acá abajo el código de 6 dígitos que también viene
              en el mail.
            </p>
            <form onSubmit={handleVerify} className="flex flex-col gap-3">
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="Código de 6 dígitos"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-center text-sm tracking-widest dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="submit"
                disabled={status === 'verifying'}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {status === 'verifying' ? 'Verificando...' : 'Ingresar con el código'}
              </button>
              {error && <p className="text-center text-xs text-red-500">{error}</p>}
            </form>
            <button
              type="button"
              onClick={handleRequestAgain}
              className="text-center text-xs text-zinc-400 hover:underline"
            >
              Pedir un link/código nuevo
            </button>
          </div>
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
