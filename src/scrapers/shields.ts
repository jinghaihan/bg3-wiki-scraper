import type { Shield } from '../types'
import { SCRAPERS_INFO } from '.'
import {
  htmlToMarkdown,
  load,
  normalizeText,
  parseTable,
  request,
} from '../utils'

export async function fetchShields() {
  const { data } = await request.get(SCRAPERS_INFO.shields.url)
  const $ = load(data)

  const shields: Shield[] = []

  $('.wikitable').each((_, element) => {
    const $element = $(element)
    parseTable($, $element, ($row, data) => {
      const { name, image, rare } = data
      const armourClassBonus = normalizeText($row.find('td:nth-child(2)'))
      const weight = normalizeText($row.find('td:nth-child(3)'))
      const price = normalizeText($row.find('td:nth-child(4)'))
      const special = htmlToMarkdown($row.find('td:nth-child(5)').html() || '')

      shields.push({
        name,
        image,
        rare,
        armourClassBonus,
        weight,
        price: Number.parseInt(price),
        special,
      })
    })
  })

  return shields
}
