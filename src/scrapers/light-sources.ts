import type { LightSource, Rarity } from '../types'
import { SCRAPERS_INFO } from '.'
import {
  htmlToMarkdown,
  load,
  normalizeLowerCaseText,
  normalizeText,
  parseTable,
  request,
} from '../utils'

export async function fetchLightSources() {
  const { data } = await request.get(SCRAPERS_INFO['light-sources'].url)
  const $ = load(data)

  const lightSources: LightSource[] = []
  let rare: Rarity

  $('h3, .wikitable').each((_, element) => {
    const $element = $(element)
    if ($element.is('h3')) {
      rare = normalizeLowerCaseText<Rarity>($element.find('.mw-headline'))
    }
    if ($element.is('table')) {
      parseTable($, $element, ($row, data) => {
        const { name, image } = data

        const glowEmitted = normalizeText($row.find('td:nth-child(2)'))
        const weight = normalizeText($row.find('td:nth-child(3)'))
        const damage = htmlToMarkdown($row.find('td:nth-child(4)').html() || '')
        const description = htmlToMarkdown($row.find('td:nth-child(5)').html() || '')
        const firstSeen = normalizeText($row.find('td:nth-child(6)'))
        const chapter = firstSeen === 'Act One' ? 1 : firstSeen === 'Act Two' ? 2 : 3

        lightSources.push({
          name,
          image,
          rare,
          glowEmitted,
          weight,
          damage,
          description,
          firstSeen: chapter,
        })
      })
    }
  })
  return lightSources
}
