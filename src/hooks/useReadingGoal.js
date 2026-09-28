import { useCallback, useEffect, useState } from 'react'
import { fetchGoal, upsertGoal } from '../api/goals'
import { currentYear } from '../utils/dates'

export function useReadingGoal(year = currentYear()) {
  const [goal, setGoal] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setGoal(await fetchGoal(year))
    } finally {
      setLoading(false)
    }
  }, [year])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setTarget = useCallback(
    async (target) => {
      const updated = await upsertGoal(year, target)
      setGoal(updated)
      return updated
    },
    [year],
  )

  return { goal, loading, setTarget }
}
