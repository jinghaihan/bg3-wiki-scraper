import type { Book, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, parseList, request } from '../utils'

export async function fetchBooks(url?: string) {
  const { data } = await request.get(url ?? SCRAPERS_INFO.books.url)
  const $ = load(data)

  const books: Book[] = []
  let rare: Rarity

  $('h2, ul, dl').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      rare = normalizeLowerCaseText<Rarity>($element.find('.mw-headline'))
    }
    if ($element.is('ul') || $element.is('dl')) {
      parseList($, $element, (_, data) => {
        const { name, image } = data
        books.push({
          name,
          image,
          rare,
        })
      })
    }
  })

  return books
}
