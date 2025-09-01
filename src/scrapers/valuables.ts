import type { Valuable } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, parseList, request } from '../utils'

export async function fetchValuables() {
  const { data } = await request.get(SCRAPERS_INFO.valuables.url)
  const $ = load(data)

  const valuables: Valuable[] = []
  let valuableType: Valuable['valuableType']

  $('h3, dl').each((_, element) => {
    const $element = $(element)
    if ($element.is('h3')) {
      valuableType = normalizeLowerCaseText($element.find('.mw-headline'))
    }
    if ($element.is('dl')) {
      parseList($, $element, (_, data) => {
        const { name, image } = data
        valuables.push({
          name,
          image,
          valuableType,
        })
      })
    }
  })

  return valuables
}
