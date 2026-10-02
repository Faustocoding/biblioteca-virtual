import { useState } from 'react'
import { useAuthContext } from '../../context/AuthProvider'

const ERROR_MESSAGES = {
  'Invalid login credentials': 'Email o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con ese email. Probá iniciar sesión.',
}

export function LoginScreen() {
  const { signIn, signUp } = useAuthContext()
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [error, setError] = useState('')
  const [signedUp, setSignedUp] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !password) return

    setStatus('sending')
    setError('')
    try {
      if (mode === 'signup') {
        await signUp(trimmed, password)
        setSignedUp(true)
      } else {
        await signIn(trimmed, password)
      }
    } catch (err) {
      setError(ERROR_MESSAGES[err.message] ?? 'Ocurrió un error. Probá de nuevo.')
      setStatus('error')
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'login' ? 'signup' : 'login'))
    setError('')
    setStatus('idle')
    setSignedUp(false)
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <h1 className="mb-1 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Mi Biblioteca
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {mode === 'login' ? 'Ingresá con tu email y contraseña.' : 'Creá tu cuenta.'}
        </p>

        {signedUp ? (
          <p className="rounded-xl border border-zinc-200 p-3 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            Cuenta creada. Ya podés iniciar sesión con tu email y contraseña.
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
            <input
              type="password"
              required
              minLength={6}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {status === 'sending'
                ? 'Un momento...'
                : mode === 'login'
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}
            </button>
            {error && <p className="text-center text-xs text-red-500">{error}</p>}
          </form>
        )}

        <button
          type="button"
          onClick={toggleMode}
          className="mt-4 w-full text-center text-xs text-zinc-400 hover:underline"
        >
          {mode === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
        </button>
      </div>
    </div>
  )
}
