import { SCRAPERS_INFO } from '.'
import { fetchBooks } from './books'

export async function fetchNotes() {
  return await fetchBooks(SCRAPERS_INFO.notes.url)
}
