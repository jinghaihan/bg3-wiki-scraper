import type { Key } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, normalizeText, parseList, request } from '../utils'

export async function fetchKeys() {
  const { data } = await request.get(SCRAPERS_INFO.keys.url)
  const $ = load(data)

  const keys: Key[] = []
  let header: string
  let chapter: number

  $('h2, h3, dl').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      header = normalizeText($element.find('.mw-headline'))
    }
    if ($element.is('h3')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      chapter = text.includes('one')
        ? 1
        : text.includes('two')
          ? 2
          : 3
    }
    if ($element.is('dl')) {
      if (header !== 'Keys')
        return

      parseList($, $element, (_, data) => {
        const { name, image } = data
        keys.push({
          name,
          image,
          chapter,
        })
      })
    }
  })

  return keys
}
