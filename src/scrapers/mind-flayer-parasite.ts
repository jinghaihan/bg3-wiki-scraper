import type { MindFlayerParasite } from '../types'
import { SCRAPERS_INFO } from '.'
import { CHAPTERS } from '../constants'
import { cleanText, htmlToMarkdown, load, normalizeText, request } from '../utils'

export async function fetchMindFlayerParasite() {
  const { data } = await request.get(SCRAPERS_INFO['mind-flayer-parasite'].url)
  const $ = load(data)

  const parasites: MindFlayerParasite[] = []

  // Directly find the Mind flayer parasite locations section and work from there
  const parasiteLocationHeader = $('h2').filter((_, el) => {
    return $(el).find('.mw-headline').text().includes('Mind flayer parasite locations')
  })

  if (parasiteLocationHeader.length === 0) {
    return parasites
  }

  // Get all elements after this header until the next h2
  let currentElement = parasiteLocationHeader.next()
  let currentChapter = 1
  let currentSectionType: 'True Souls' | 'Loot' | 'Quest rewards' | null = null

  while (currentElement.length > 0 && !currentElement.is('h2')) {
    const tagName = currentElement.prop('tagName')?.toLowerCase()

    if (tagName === 'h3') {
      const title = normalizeText(currentElement.find('.mw-headline'))

      // Update chapter based on Act headings
      currentChapter = CHAPTERS.findIndex(flag => title.includes(flag)) + 1
    }

    if (tagName === 'h4') {
      const title = normalizeText(currentElement.find('.mw-headline'))

      if (title === 'True Souls') {
        currentSectionType = 'True Souls'
      }
      else if (title === 'Loot') {
        currentSectionType = 'Loot'
      }
      else if (title === 'Quest rewards') {
        currentSectionType = 'Quest rewards'
      }
      else {
        currentSectionType = null
      }
    }

    if (tagName === 'ul' && currentSectionType) {
      const listItems = currentElement.find('li').toArray()

      listItems.forEach((li) => {
        const $li = $(li)
        const text = normalizeText($li)

        if (!text)
          return

        let count = 1
        let description = $li.html() || ''

        // Extract position coordinates from text
        const positionMatch = text.match(/X:\s*(-?\d+)\s+Y:\s*(-?\d+)/)
        const position = positionMatch
          ? {
              x: Number.parseInt(positionMatch[1]),
              y: Number.parseInt(positionMatch[2]),
            }
          : undefined

        if (currentSectionType === 'True Souls') {
          // For True Souls, count is always 1
          count = 1
        }
        else if (currentSectionType === 'Loot') {
          // Extract count from One, Two, Three, Six at the beginning
          const countMatch = text.match(/^(One|Two|Three|Six)\s+/)
          if (countMatch) {
            const countWord = countMatch[1].toLowerCase()
            switch (countWord) {
              case 'one':
                count = 1
                break
              case 'two':
                count = 2
                break
              case 'three':
                count = 3
                break
              case 'six':
                count = 6
                break
            }
          }
        }
        else if (currentSectionType === 'Quest rewards') {
          // For Quest rewards, count is always 1
          count = 1
        }

        // Convert to markdown and clean
        description = htmlToMarkdown(description)

        // Clean patterns specific to each section type
        const cleanPatterns: RegExp[] = []

        if (currentSectionType === 'Loot' && text.match(/^(One|Two|Three|Six)\s+/)) {
          cleanPatterns.push(/^(One|Two|Three|Six)\s+/)
        }

        description = cleanText(description, cleanPatterns)

        parasites.push({
          chapter: currentChapter,
          count,
          description: description.trim(),
          position,
        })
      })
    }

    currentElement = currentElement.next()
  }

  return parasites
}
