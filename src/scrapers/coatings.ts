import type { Coatings, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import {
  htmlToMarkdown,
  load,
  normalizeLowerCaseText,
  normalizeText,
  parseItem,
  parseTable,
  request,
} from '../utils'

export async function fetchCoatings() {
  const { data } = await request.get(SCRAPERS_INFO.coatings.url)
  const $ = load(data)

  const coatings: Coatings[] = []
  let isComplete: boolean = false

  $('.wikitable').each((_, element) => {
    if (isComplete)
      return
    isComplete = true

    const $element = $(element)
    parseTable($, $element, (row, data) => {
      const { name, image } = data

      const ingredient = row.find('td:nth-child(2)')
      const { name: ingredientName, image: ingredientImage } = parseItem(ingredient)

      const rare = normalizeLowerCaseText<Rarity>(row.find('td:nth-child(3)'))
      const price = normalizeText(row.find('td:nth-child(4)'))
      const tradeLevel = normalizeText(row.find('td:nth-child(5)'))
      const throwable = normalizeText(row.find('td:nth-child(6)')) === 'Yes'
      const dc = normalizeText(row.find('td:nth-child(7)'))
      const dcNumber = Number.parseInt(dc)
      const effect = htmlToMarkdown(row.find('td:nth-child(8)').html() || '')

      coatings.push({
        name,
        image,
        ingredientName,
        ingredientImage,
        rare,
        price: Number.parseInt(price),
        tradeLevel: Number.parseInt(tradeLevel),
        throwable,
        dc: Number.isNaN(dcNumber) ? dcNumber : undefined,
        effect,
      })
    })
  })

  return coatings
}
