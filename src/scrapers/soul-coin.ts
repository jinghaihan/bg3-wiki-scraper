import type * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import type { SoulCoin } from '../types'
import { SCRAPERS_INFO } from '.'
import { CHAPTERS } from '../constants'
import { cleanText, htmlToMarkdown, load, normalizeText, request } from '../utils'

function parseSoulCoinElement($element: cheerio.Cheerio<Element>) {
  const text = normalizeText($element)

  const countMatch = text.match(/^(\d+)x\s*-\s*/)
  const count = countMatch ? Number.parseInt(countMatch[1]) : 1

  const positionMatch = text.match(/X:\s*(-?\d+)\s+Y:\s*(-?\d+)/)
  const position = positionMatch
    ? {
        x: Number.parseInt(positionMatch[1]),
        y: Number.parseInt(positionMatch[2]),
      }
    : undefined

  // Convert HTML to markdown format
  let description = $element.html() || ''
  description = htmlToMarkdown(description)

  // Define patterns to clean
  const cleanPatterns: RegExp[] = []

  // Remove count prefix
  if (countMatch) {
    cleanPatterns.push(new RegExp(`^${countMatch[1]}x\\s*-\\s*`))
  }

  // Remove position suffix
  if (positionMatch) {
    cleanPatterns.push(/\s+at\s+X:\s*-?\d+\s+Y:\s*-?\d+$/)
  }

  description = cleanText(description, cleanPatterns)

  return { count, position, description }
}

export async function fetchSoulCoin() {
  const { data } = await request.get(SCRAPERS_INFO['soul-coin'].url)
  const $ = load(data)

  const box = $('.mw-parser-output .bg3wiki-tooltip-box').toArray()[2]
  const $box = $(box)
  const list: SoulCoin[] = []

  let chapter: number
  $box.children().each((_, element) => {
    const $element = $(element)
    if ($element.is('h3')) {
      const text = normalizeText($element)
      const index = CHAPTERS.findIndex(flag => text.includes(flag))
      if (index !== -1) {
        chapter = index + 1
      }
    }
    if ($element.is('ul')) {
      const li = $element.find('li').toArray()
      li.forEach((liElement) => {
        const $li = $(liElement)
        const parsed = parseSoulCoinElement($li)

        list.push({
          chapter,
          count: parsed.count,
          description: parsed.description,
          position: parsed.position,
        })
      })
    }
  })

  return list
}
