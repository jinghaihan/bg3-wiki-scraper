import type { ArmourType } from '../types'
import {
  htmlToMarkdown,
  load,
  normalizeLowerCaseText,
  normalizeText,
  parseTable,
  request,
} from '../utils'

export async function fetchEquipment<T>(url: string) {
  const { data } = await request.get(url)
  const $ = load(data)

  const handwear: T[] = []
  let armourType: ArmourType

  $('h3, .wikitable').each((_, element) => {
    const $element = $(element)
    if ($element.is('h3')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline')).split('-').join(' ')
      armourType = (text.endsWith('armour') ? text : `${text} armour`) as ArmourType
    }
    if ($element.is('table')) {
      parseTable($, $element, ($row, data) => {
        const { name, image, rare } = data

        const weight = normalizeText($row.find('td:nth-child(2)'))
        const price = normalizeText($row.find('td:nth-child(3)'))
        const effects = htmlToMarkdown($row.find('td:nth-child(4)').html() || '')

        handwear.push({
          name,
          image,
          armourType,
          rare,
          weight,
          price: Number.parseInt(price),
          effects,
        } as T)
      })
    }
  })

  return handwear
}
