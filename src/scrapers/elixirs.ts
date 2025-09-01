import type { Elixir, ElixirType, Rarity } from '../types'
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

export async function fetchElixirs() {
  const { data } = await request.get(SCRAPERS_INFO.elixirs.url)
  const $ = load(data)

  const elixirs: Elixir[] = []
  let elixirType: ElixirType

  $('.wikitable').each((_, element) => {
    const $element = $(element)
    elixirType = normalizeLowerCaseText($element.find('caption')).replace('list of ', '').replace(' elixirs', '') as ElixirType
    parseTable($, $element, (row, data) => {
      const { name, image } = data

      if (elixirType !== 'unique') {
        const ingredient = row.find('td:nth-child(2)')
        const { name: ingredientName, image: ingredientImage } = parseItem(ingredient)

        const rare = normalizeLowerCaseText<Rarity>(row.find('td:nth-child(3)'))
        const price = Number.parseInt(normalizeText(row.find('td:nth-child(4)')))
        const tradeLevel = Number.parseInt(normalizeText(row.find('td:nth-child(5)')))
        const throwable = normalizeText(row.find('td:nth-child(6)')).includes('Yes')
        const effect = htmlToMarkdown(row.find('td:nth-child(7)').html() || '')

        elixirs.push({
          name,
          image,
          elixirType,
          ingredientName,
          ingredientImage,
          rare,
          price,
          tradeLevel: Number.isNaN(tradeLevel) ? undefined : tradeLevel,
          throwable,
          effect,
        })
      }
      else {
        const race = row.find('td:nth-child(2)')
        const { name: raceName, image: raceImage } = parseItem(race)

        const rare = normalizeLowerCaseText<Rarity>(row.find('td:nth-child(3)'))
        const price = Number.parseInt(normalizeText(row.find('td:nth-child(4)')))
        const effect = htmlToMarkdown(row.find('td:nth-child(5)').html() || '')

        elixirs.push({
          name,
          image,
          elixirType,
          raceName,
          raceImage,
          rare,
          price,
          effect,
          throwable: false,
        })
      }
    })
  })

  return elixirs
}
