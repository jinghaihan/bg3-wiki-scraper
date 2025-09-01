import type { Dye, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, parseList, request } from '../utils'

export async function fetchDyes() {
  const { data } = await request.get(SCRAPERS_INFO.dyes.url)
  const $ = load(data)

  const dyes: Dye[] = []
  let rare: Rarity = 'common'
  let list: string = ''

  $('h2, h3, ul').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline')).replace(' dyes', '')
      rare = text as Rarity
    }
    if ($element.is('h3')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      list = text
    }
    if ($element.is('ul')) {
      if (list.includes('list of dyes')) {
        parseList($, $element, (row, data) => {
          const { name, image } = data
          dyes.push({
            name,
            image,
            rare,
          })
        })
      }
    }
  })

  return dyes
}
