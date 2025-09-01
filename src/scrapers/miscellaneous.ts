import type { Miscellaneous } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, parseList, request } from '../utils'

export async function fetchMiscellaneous() {
  const { data } = await request.get(SCRAPERS_INFO.miscellaneous.url)
  const $ = load(data)

  const miscellaneous: Miscellaneous[] = []
  let miscellaneousType: Miscellaneous['miscellaneousType']

  $('h3, dl').each((_, element) => {
    const $element = $(element)
    if ($element.is('h3')) {
      miscellaneousType = normalizeLowerCaseText($element.find('.mw-headline'))
    }
    if ($element.is('dl')) {
      parseList($, $element, (_, data) => {
        if (!['interactive', 'consumables', 'clutter'].includes(miscellaneousType))
          return

        const { name, image } = data
        miscellaneous.push({
          name,
          image,
          miscellaneousType,
        })
      })
    }
  })

  return miscellaneous
}
