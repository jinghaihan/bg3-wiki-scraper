import type { Element } from 'domhandler'
import type { Rarity } from './types'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { BASE_URL, RARITY_COLOR_MAPS } from './constants'

export const request = axios.create({
  timeout: 5 * 60 * 1000,
})

export function load(html: string) {
  const $ = cheerio.load(html)
  $('.navbox, .toc').remove()
  return $
}

export function parseTable(
  $: cheerio.CheerioAPI,
  $element: cheerio.Cheerio<Element>,
  parseRow: (
    row: cheerio.Cheerio<Element>,
    data: { name: string, image: string, rare: Rarity }
  ) => void,
) {
  const rows = $element.find('tbody').find('tr')
  rows.each((_, row) => {
    const $row = $(row)
    const $firstCell = $row.find('td:nth-child(1)').html()
      ? $row.find('td:nth-child(1)')
      : $row.find('th:nth-child(1)')

    const { name, image } = parseItem($firstCell, true)
    if (!name || !image)
      return

    parseRow($row, { name, image, rare: parseRarity($firstCell.find('a').eq(1)) })
  })
}

export function parseList(
  $: cheerio.CheerioAPI,
  $element: cheerio.Cheerio<Element>,
  parseLi: (
    item: cheerio.Cheerio<Element>,
    data: { name: string, image: string, rare: Rarity }
  ) => void,
) {
  const li = $element.find('li').toArray()
  const dd = $element.find('dd').toArray()
  const arr = li.length ? li : dd
  arr.forEach((item) => {
    const el = $(item)

    const { name, image } = parseItem(el)
    if (!name || !image)
      return

    const $icon = el.find('.bg3wiki-itemicon')
    const rare = parseRarity($icon)

    parseLi(el, { name, image, rare })
  })
}

export function parseItem($element: cheerio.Cheerio<Element>, isTable: boolean = false) {
  const $name = isTable
    ? $element.find('a').eq(1)
    : $element.find('.bg3wiki-itemicon-link a').html()
      ? $element.find('.bg3wiki-itemicon-link a')
      : $element.find('.bg3wiki-icontext-text a')

  const a = $name?.prop('outerHTML')?.trim() || ''
  const imgSrc = $element.find('img').attr('src') || ''
  if (!a || !imgSrc)
    return {}

  const name = htmlToMarkdown(a)
  const image = normalizeUrl(imgSrc)
  return { name, image }
}

export function parseRarity($element: cheerio.Cheerio<Element>): Rarity {
  const classList = $element.attr('class') || ''
  if (classList.includes('bg3wiki-itemicon-common')) {
    return 'common'
  }
  else if (classList.includes('bg3wiki-itemicon-rare')) {
    return 'rare'
  }
  else if (classList.includes('bg3wiki-itemicon-story')) {
    return 'story item'
  }
  else if (classList.includes('bg3wiki-itemicon-uncommon')) {
    return 'uncommon'
  }
  else if (classList.includes('bg3wiki-itemicon-very-rare')) {
    return 'very rare'
  }
  else if (classList.includes('bg3wiki-itemicon-legendary')) {
    return 'legendary'
  }

  const style = $element.find('span').attr('style')!
  if (!style) {
    return 'common'
  }
  const index = Object.entries(RARITY_COLOR_MAPS).findIndex(([color]) => style.toUpperCase().includes(color))
  return (index !== -1 ? Object.entries(RARITY_COLOR_MAPS)[index][1] : 'common') as Rarity
}

export function htmlToMarkdown(html: string): string {
  let markdown = html

  // Convert anchor tags to markdown format, prepending BASE_URL for relative links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gs, (match, href, content) => {
    const fullUrl = normalizeUrl(href)
    // Extract text content from potentially nested HTML
    const text = content.replace(/<[^>]*>/g, '').trim()
    if (text) {
      return `[${text}](${fullUrl})`
    }
    return ''
  })

  // Clean up any remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '').trim()

  // Convert HTML entities to regular characters
  markdown = markdown.replace(/&nbsp;/g, ' ')
  markdown = markdown.replace(/&amp;/g, '&')
  markdown = markdown.replace(/&lt;/g, '<')
  markdown = markdown.replace(/&gt;/g, '>')
  markdown = markdown.replace(/&quot;/g, '"')
  markdown = markdown.replace(/&#39;/g, '\'')

  // Remove empty parentheses
  markdown = markdown.replace(/\(\)/g, '')

  return markdown.trim()
}

export function cleanText(text: string, patterns: RegExp[]): string {
  let cleaned = text
  patterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '').trim()
  })
  return cleaned
}

export function normalizeUrl(url: string): string {
  if (url.startsWith('http')) {
    return url
  }
  return `${BASE_URL}${url}`
}

export function normalizeText<T extends string>($element: cheerio.Cheerio<Element>): T {
  const text = $element.text().trim()
  return text as T
}

export function normalizeLowerCaseText<T extends string>($element: cheerio.Cheerio<Element>): T {
  const text = $element.text().trim().toLowerCase()
  return text as T
}

export async function executeWithConcurrency<T>(tasks: (() => Promise<T>)[], concurrency: number = 3): Promise<T[]> {
  const results: T[] = Array.from({ length: tasks.length })
  const executing: Array<Promise<void>> = []

  for (let i = 0; i < tasks.length; i++) {
    const task = async () => {
      results[i] = await tasks[i]()
    }

    const promise = task().then(() => {
      executing.splice(executing.indexOf(promise), 1)
    })

    executing.push(promise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
    }
  }

  await Promise.all(executing)
  return results
}
