import { supabase } from '../lib/supabase'

export async function fetchGoal(year) {
  const { data, error } = await supabase
    .from('reading_goals')
    .select('*')
    .eq('year', year)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertGoal(year, target) {
  const { data, error } = await supabase
    .from('reading_goals')
    .upsert({ year, target })
    .select()
    .single()

  if (error) throw error
  return data
}
