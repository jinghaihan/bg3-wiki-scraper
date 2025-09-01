import type { MusicalInstrument } from '../types'
import { SCRAPERS_INFO } from '.'
import { htmlToMarkdown, load, normalizeLowerCaseText, normalizeUrl, parseRarity, request } from '../utils'

export async function fetchMusicalInstruments() {
  const { data } = await request.get(SCRAPERS_INFO['musical-instruments'].url)
  const $ = load(data)

  const musicalInstruments: MusicalInstrument[] = []
  let instrumentType: MusicalInstrument['instrumentType'] = 'starting'

  // Find h3 headers and their following ul elements
  $('h3').each((_, element) => {
    const $element = $(element)
    const text = normalizeLowerCaseText($element.find('.mw-headline'))

    // Determine instrument type based on section header
    if (text.includes('starting')) {
      instrumentType = 'starting'
    }
    else if (text.includes('unique')) {
      instrumentType = 'unique'
    }

    // Find the ul element that follows this h3
    let $nextElement = $element.next()
    while ($nextElement.length > 0 && !$nextElement.is('ul')) {
      $nextElement = $nextElement.next()
    }

    if ($nextElement.is('ul')) {
      // Process each list item in the ul
      $nextElement.find('li').each((_, li) => {
        const $li = $(li)

        // Extract name from the link text
        const $nameLink = $li.find('.bg3wiki-itemicon-link a')
        const name = htmlToMarkdown($nameLink.prop('outerHTML') || '')

        if (!name)
          return

        // Extract image from img src
        const $img = $li.find('img')
        const image = normalizeUrl($img.attr('src') || '')

        // Extract rarity from icon class
        const rare = parseRarity($li.find('.bg3wiki-itemicon'))

        musicalInstruments.push({
          name,
          image,
          rare,
          instrumentType,
        })
      })
    }
  })

  return musicalInstruments
}
