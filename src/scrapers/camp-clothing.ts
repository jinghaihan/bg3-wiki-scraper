import type { CampClothing } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, parseList, request } from '../utils'

export async function fetchCampClothing() {
  const { data } = await request.get(SCRAPERS_INFO['camp-clothing'].url)
  const $ = load(data)

  const campClothing: CampClothing[] = []

  let isSpecific: boolean = false
  let clothingType: CampClothing['clothingType'] = 'unsorted'
  let character: CampClothing['character']

  $('h2, h3, h4, ul').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      isSpecific = text.includes('character specific')
      if (text.includes('twitch')) {
        clothingType = 'twitch'
        character = undefined
      }
    }
    if ($element.is('h3')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      if (text.includes('starting')) {
        clothingType = 'starting'
      }
      if (text.includes('epilogue')) {
        clothingType = 'epilogue'
      }
    }
    if ($element.is('h4')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      if (isSpecific) {
        character = (text.includes('dark urge')
          ? 'durge'
          : text.includes('other')
            ? 'tav'
            : text) as CampClothing['character']
      }
      else {
        clothingType = text as CampClothing['clothingType']
      }
    }
    if ($element.is('ul')) {
      parseList($, $element, (li, data) => {
        const { name, image } = data
        campClothing.push({
          name,
          image,
          clothingType,
          character,
        })
      })
    }
  })

  return campClothing
}
