import { useAuthContext } from '../../context/AuthProvider'

export function SignOutButton() {
  const { signOut } = useAuthContext()

  return (
    <button
      type="button"
      onClick={signOut}
      aria-label="Cerrar sesión"
      className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
      title="Cerrar sesión"
    >
      ⏻
    </button>
  )
}
