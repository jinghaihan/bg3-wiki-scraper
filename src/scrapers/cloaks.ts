import type { Cloak, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import {
  htmlToMarkdown,
  load,
  normalizeLowerCaseText,
  normalizeText,
  parseTable,
  request,
} from '../utils'

export async function fetchCloaks() {
  const { data } = await request.get(SCRAPERS_INFO.cloaks.url)
  const $ = load(data)

  const cloaks: Cloak[] = []
  let rare: Rarity

  $('h3, .wikitable').each((_, element) => {
    const $element = $(element)
    if ($element.is('h3')) {
      rare = normalizeLowerCaseText<Rarity>($element.find('.mw-headline'))
    }
    if ($element.is('table')) {
      parseTable($, $element, ($row, data) => {
        const { name, image } = data

        const weight = normalizeText($row.find('td:nth-child(2)'))
        const price = normalizeText($row.find('td:nth-child(3)'))
        const effects = htmlToMarkdown($row.find('td:nth-child(4)').html() || '')

        cloaks.push({
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

  return cloaks
}
