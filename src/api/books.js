import { supabase } from '../lib/supabase'

export async function fetchBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addBookFromSearchResult(result) {
  const { data, error } = await supabase
    .from('books')
    .insert({
      title: result.title,
      author: result.author,
      cover_url: result.coverUrl,
      category: result.category ?? null,
      total_pages: result.totalPages ?? null,
      status: 'to_read',
      source_api: result.source,
      source_id: result.sourceId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBook(id, patch) {
  const { data, error } = await supabase
    .from('books')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBook(id) {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}

export async function reorderToReadBooks(orderedIds) {
  const updates = orderedIds.map((id, index) =>
    supabase.from('books').update({ sort_order: index }).eq('id', id),
  )
  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed) throw failed.error
}
