import type { Spell } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, parseList, request } from '../utils'

export async function fetchSpells() {
  const { data } = await request.get(SCRAPERS_INFO.spells.url)
  const $ = load(data)

  const spells: Spell[] = []
  let analysis: boolean = false
  let level: number
  let isCantrip: boolean = false

  $('h2, h3, ul').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      if (text.includes('without scrolls'))
        analysis = true
      else
        analysis = false
    }
    if ($element.is('h3')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline')).replace('level ', '')
      const spellLevel = Number.parseInt(text)
      if (Number.isNaN(spellLevel)) {
        isCantrip = true
        level = 0
      }
      else {
        isCantrip = false
        level = spellLevel
      }
    }
    if ($element.is('ul')) {
      parseList($, $element, (li, data) => {
        if (analysis) {
          const { name, image } = data
          spells.push({
            name,
            image,
            level: isCantrip ? undefined : level,
            cantrip: isCantrip,
          })
        }
      })
    }
  })

  return spells
}
