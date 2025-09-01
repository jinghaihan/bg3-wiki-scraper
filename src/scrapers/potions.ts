import type { Potion, PotionType, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import { htmlToMarkdown, load, normalizeLowerCaseText, normalizeText, parseItem, parseList, parseTable, request } from '../utils'

export async function fetchPotions() {
  const { data } = await request.get(SCRAPERS_INFO.potions.url)
  const $ = load(data)

  const potions: Potion[] = []
  let potionType: PotionType

  $('h2, .wikitable, ul').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      potionType = normalizeLowerCaseText($element.find('.mw-headline'))
        .replace(`'s`, '')
        .replace(' potions', '') as PotionType
    }
    if ($element.is('table')) {
      parseTable($, $element, (row, data) => {
        const { name, image, rare } = data

        if (potionType === 'healing' || potionType === 'regular') {
          const { name: ingredientName, image: ingredientImage } = parseItem(row.find('td:nth-child(2)'))

          const rare = normalizeLowerCaseText<Rarity>(row.find('td:nth-child(3)'))
          const price = Number.parseInt(normalizeText(row.find('td:nth-child(4)')))
          const tradeLevel = Number.parseInt(normalizeText(row.find('td:nth-child(5)')))
          const throwable = normalizeText(row.find('td:nth-child(6)')).includes('Yes')
          const effect = htmlToMarkdown(row.find('td:nth-child(7)').html() || '')

          potions.push({
            name,
            image,
            rare,
            price,
            potionType,
            ingredientName,
            ingredientImage,
            tradeLevel: Number.isNaN(tradeLevel) ? undefined : tradeLevel,
            throwable,
            effect,
          })
        }
        else {
          const duration = normalizeText(row.find('td:nth-child(2)'))
          const effect = htmlToMarkdown(row.find('td:nth-child(3)').html() || '')

          potions.push({
            name,
            image,
            rare,
            potionType,
            duration,
            effect,
          })
        }
      })
    }
    if ($element.is('ul')) {
      if (potionType === 'legacy') {
        parseList($, $element, (li, data) => {
          const { name, image, rare } = data

          potions.push({
            name,
            image,
            rare,
            potionType,
          })
        })
      }
    }
  })

  return potions
}
