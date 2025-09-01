import type { Element } from 'domhandler'
import type { Quest, QuestList, SubQuest } from '../types'
import * as cheerio from 'cheerio'
import { SCRAPERS_INFO } from '.'
import { BASE_URL, CHAPTERS } from '../constants'
import { load, normalizeText, request } from '../utils'

export async function fetchQuests() {
  const { data } = await request.get(SCRAPERS_INFO.quests.url)
  const $ = load(data)

  const questList: QuestList[] = []
  let currentH2: QuestList | null = null
  let currentH3: QuestList | null = null

  const elements = $('.mw-parser-output h2, .mw-parser-output h3, .mw-parser-output .bg3wiki-imagetext').toArray()

  elements.forEach((element) => {
    const $element = $(element)
    const tagName = element.tagName.toLowerCase()

    if (tagName === 'h2') {
      const title = normalizeText($element.find('.mw-headline')) || normalizeText($element)
      if (title && !title.includes('Contents')) {
        currentH2 = {
          title,
          quests: [],
        }
        questList.push(currentH2)
        currentH3 = null
      }
    }
    else if (tagName === 'h3') {
      const title = normalizeText($element.find('.mw-headline')) || normalizeText($element)
      if (title && currentH2) {
        currentH3 = {
          title,
          quests: [],
        }
        currentH2.children = currentH2.children || []
        currentH2.children.push(currentH3)
      }
    }
    else if ($element.hasClass('bg3wiki-imagetext')) {
      const quest = parseQuest($element)
      if (quest) {
        const targetContainer = currentH3 || currentH2
        if (targetContainer) {
          targetContainer.quests = targetContainer.quests || []
          targetContainer.quests.push(quest)
        }
      }
    }
  })

  return questList.filter((category) => {
    if (category.children) {
      category.children = category.children.filter(subcategory =>
        subcategory.quests && subcategory.quests.length > 0,
      )
    }
    return (category.quests && category.quests.length > 0)
      || (category.children && category.children.length > 0)
  })
}

function parseQuest($container: cheerio.Cheerio<Element>): Quest | null {
  const $ = cheerio.load($container.html() || '')

  const img = $('img').first()
  const src = img.attr('src')
  const alt = img.attr('alt')

  if (!src || !alt) {
    return null
  }

  const mainLink = $('a').first()
  const questTitle = mainLink.attr('title') || alt

  const chapter: number[] = []
  CHAPTERS.forEach((flag, index) => {
    if ($(`a`).toArray().find(a => a.attribs.title === flag)) {
      chapter.push(index + 1)
    }
  })

  const node = $('span[style*="font-size: 80%"]').contents().filter(function () {
    return this.nodeType === 3
  }).first()
  const description = normalizeText(node as cheerio.Cheerio<Element>) || undefined

  const subQuests: SubQuest[] = []
  $('a').each((_, element) => {
    const $link = $(element)
    const href = $link.attr('href')
    const title = $link.attr('title') || normalizeText($link)

    if (href && title
      && !title.includes('Act ')
      && title !== questTitle
      && !href.includes('#')
      && href.startsWith('/wiki/')) {
      subQuests.push({
        title,
        link: `${BASE_URL}${href}`,
      })
    }
  })

  return {
    image: `${BASE_URL}${src}`,
    title: questTitle,
    chapter: chapter.length > 0 ? chapter : undefined,
    description,
    subQuests: subQuests.length > 0 ? subQuests : undefined,
  }
}
