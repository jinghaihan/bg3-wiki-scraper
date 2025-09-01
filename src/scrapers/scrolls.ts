import type { Scroll } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, parseList, request } from '../utils'

export async function fetchScrolls() {
  const { data } = await request.get(SCRAPERS_INFO.scrolls.url)
  const $ = load(data)

  const scrolls: Scroll[] = []
  let level: number
  let header: string
  let isLimit: boolean = false
  let limitType: Scroll['limitType']

  $('h2, h3, ul').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      header = normalizeLowerCaseText($element.find('.mw-headline'))
      isLimit = header.includes('limit')
    }
    if ($element.is('h3')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
        .replace('level ', '')
        .replace(' spells', '')

      if (!isLimit) {
        level = Number.parseInt(text)
      }
      else {
        limitType = text.includes('trader')
          ? 'trader'
          : text.includes('limited')
            ? 'limited'
            : 'unique'
      }
    }
    if ($element.is('ul')) {
      if (header !== 'list of scrolls' && header !== 'limited scrolls')
        return

      parseList($, $element, (li, data) => {
        if (!isLimit) {
          if (!level || typeof level !== 'number')
            return

          const { name, image } = data
          scrolls.push({
            name,
            image,
            level,
          })
        }
        else {
          const { name } = data
          const index = scrolls.findIndex(scroll => scroll.name === name)
          scrolls[index].limitType = limitType
        }
      })
    }
  })

  return scrolls
}
