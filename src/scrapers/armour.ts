import type { Armour, ArmourType } from '../types'
import { SCRAPERS_INFO } from '.'
import {
  htmlToMarkdown,
  load,
  normalizeLowerCaseText,
  normalizeText,
  parseTable,
  request,
} from '../utils'

export async function fetchArmour() {
  const { data } = await request.get(SCRAPERS_INFO.armour.url)
  const $ = load(data)

  const armours: Armour[] = []
  let armourType: ArmourType

  $('h2, .wikitable').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      armourType = normalizeLowerCaseText($element.find('.mw-headline')).replace('list of ', '') as ArmourType
    }
    if ($element.is('table')) {
      parseTable($, $element, ($row, data) => {
        const { name, image, rare } = data

        const armourClass = normalizeText($row.find('td:nth-child(2)'))
        const stealthDisadvantage = normalizeText($row.find('td:nth-child(3)')) === 'Yes'
        const weight = normalizeText($row.find('td:nth-child(4)'))
        const price = normalizeText($row.find('td:nth-child(5)'))
        const special = htmlToMarkdown($row.find('td:nth-child(6)').html() || '')

        armours.push({
          name,
          image,
          rare,
          armourType,
          armourClass: Number.parseInt(armourClass),
          stealthDisadvantage,
          weight,
          price: Number.parseInt(price),
          special,
        })
      })
    }
  })

  return armours
}
