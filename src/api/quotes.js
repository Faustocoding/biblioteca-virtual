import { supabase } from '../lib/supabase'

export async function fetchQuotesByBook(bookId) {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function fetchAllQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*, books(id, title, author, cover_url)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addQuote(bookId, { text, page }) {
  const { data, error } = await supabase
    .from('quotes')
    .insert({ book_id: bookId, text, page: page ?? null })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteQuote(id) {
  const { error } = await supabase.from('quotes').delete().eq('id', id)
  if (error) throw error
}
