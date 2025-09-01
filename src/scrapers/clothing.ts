import type { Clothing } from '../types'
import { SCRAPERS_INFO } from '.'
import {
  htmlToMarkdown,
  load,
  normalizeText,
  parseTable,
  request,
} from '../utils'

export async function fetchClothing() {
  const { data } = await request.get(SCRAPERS_INFO.clothing.url)
  const $ = load(data)

  const clothing: Clothing[] = []

  $('.wikitable').each((_, element) => {
    const $element = $(element)
    if ($element.is('table')) {
      parseTable($, $element, ($row, data) => {
        const { name, image, rare } = data

        const weight = normalizeText($row.find('td:nth-child(2)'))
        const price = normalizeText($row.find('td:nth-child(3)'))
        const effects = htmlToMarkdown($row.find('td:nth-child(4)').html() || '')

        clothing.push({
          name,
          image,
          rare,
          weight,
          price: Number.parseInt(price),
          effects,
        })
      })
    }
  })

  return clothing
}
