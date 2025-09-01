import type { Arrow, ArrowType, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import { ARROW_TYPES } from '../constants'
import {
  htmlToMarkdown,
  load,
  normalizeLowerCaseText,
  normalizeText,
  parseList,
  parseTable,
  request,
} from '../utils'

export async function fetchArrows() {
  const { data } = await request.get(SCRAPERS_INFO.arrows.url)
  const $ = load(data)

  const arrows: Arrow[] = []
  let arrowType: ArrowType = 'regular'

  $('h2, ul, .wikitable').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      const [type] = text.split(' ')
      arrowType = type as ArrowType
    }
    if ($element.is('table')) {
      parseTable($, $element, ($row, data) => {
        const { name, image } = data

        const rare = normalizeLowerCaseText<Rarity>($row.find('td:nth-child(2)'))
        const price = Number.parseInt(normalizeText($row.find('td:nth-child(3)')))
        const tradeLevel = Number.parseInt(normalizeText($row.find('td:nth-child(4)')))
        const type = normalizeText($row.find('td:nth-child(5)'))
        const effect = htmlToMarkdown($row.find('td:nth-child(6)').html() || '')

        arrows.push({
          name,
          image,
          arrowType,
          rare,
          price,
          tradeLevel,
          type,
          effect,
        })
      })
    }
    if ($element.is('ul')) {
      if (!ARROW_TYPES.includes(arrowType))
        return

      parseList($, $element, (li, data) => {
        const { name, image, rare } = data

        arrows.push({
          name,
          image,
          rare,
          arrowType,
        })
      })
    }
  })

  return arrows
}
