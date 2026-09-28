import { useEffect, useState } from 'react'

const STORAGE_KEY = 'mi-biblioteca:view-mode'

function getInitialView() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'list' ? 'list' : 'shelf'
}

export function useViewMode() {
  const [view, setView] = useState(getInitialView)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, view)
  }, [view])

  return [view, setView]
}
