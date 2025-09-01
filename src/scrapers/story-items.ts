import type { StoryItem } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeLowerCaseText, normalizeText, parseList, request } from '../utils'

export async function fetchStoryItems() {
  const { data } = await request.get(SCRAPERS_INFO['story-items'].url)
  const $ = load(data)

  const storyItems: StoryItem[] = []
  let header: string
  let chapter: number | undefined

  $('h2, h3, dl').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      header = normalizeText($element.find('.mw-headline'))
    }
    if ($element.is('h3')) {
      const text = normalizeLowerCaseText($element.find('.mw-headline'))
      chapter = text.includes('across')
        ? undefined
        : text.includes('one')
          ? 1
          : text.includes('two')
            ? 2
            : 3
    }
    if ($element.is('dl')) {
      if (header !== 'Story items')
        return

      parseList($, $element, (_, data) => {
        const { name, image } = data
        storyItems.push({
          name,
          image,
          chapter,
        })
      })
    }
  })

  return storyItems
}
