import type { Grenade, GrenadeType, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import { htmlToMarkdown, load, normalizeLowerCaseText, normalizeText, parseList, parseTable, request } from '../utils'

export async function fetchGrenades() {
  const { data } = await request.get(SCRAPERS_INFO.grenades.url)
  const $ = load(data)

  const grenades: Grenade[] = []
  let grenadeType: GrenadeType

  $('h2, .wikitable, ul').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      grenadeType = normalizeLowerCaseText($element.find('.mw-headline')).replace(' grenades', '') as GrenadeType
    }
    if ($element.is('table')) {
      parseTable($, $element, (row, data) => {
        const { name, image } = data

        const rare = normalizeLowerCaseText<Rarity>(row.find('td:nth-child(2)'))
        const aoe = normalizeText(row.find('td:nth-child(3)'))

        if (grenadeType === 'regular') {
          const craftable = normalizeText(row.find('td:nth-child(4)')).includes('Yes')
          const soldBy = htmlToMarkdown(row.find('td:nth-child(5)').html() || '')
          const price = Number.parseInt(normalizeText(row.find('td:nth-child(6)')))
          const effect = htmlToMarkdown(row.find('td:nth-child(7)').html() || '')

          grenades.push({
            name,
            image,
            rare,
            aoe,
            craftable,
            soldBy,
            price,
            effect,
            grenadeType,
          })
        }
        else {
          const price = Number.parseInt(normalizeText(row.find('td:nth-child(4)')))
          const type = normalizeText(row.find('td:nth-child(5)'))
          const effect = htmlToMarkdown(row.find('td:nth-child(6)').html() || '')

          grenades.push({
            name,
            image,
            rare,
            price,
            type,
            effect,
            grenadeType,
            craftable: false,
          })
        }
      })
    }
    if ($element.is('ul')) {
      parseList($, $element, (li, data) => {
        const { name, image, rare } = data

        grenades.push({
          name,
          image,
          rare,
          grenadeType,
          craftable: false,
        })
      })
    }
  })

  return grenades
}
