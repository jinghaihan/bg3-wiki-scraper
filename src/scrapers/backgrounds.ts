import type { BackgroundGoal } from '../types'
import { SCRAPERS_INFO } from '.'
import { BACKGROUNDS } from '../constants'
import { htmlToMarkdown, load, normalizeText, request } from '../utils'

async function _fetchBackgroundGoals(background: string): Promise<BackgroundGoal[]> {
  const { data } = await request.get(`${SCRAPERS_INFO.backgrounds.url}${background}`)
  const $ = load(data)

  const table = $('.wikitable')
  const goals: BackgroundGoal[] = []

  let currentChapter: number | undefined

  table.find('tr').each((_, row) => {
    const $row = $(row)

    // Check if this is a chapter header row (has colspan="4")
    const headerCell = $row.find('th[colspan="4"]')
    if (headerCell.length > 0) {
      const headerText = normalizeText(headerCell)

      if (headerText === 'General') {
        currentChapter = undefined
      }
      else if (headerText.startsWith('Act ')) {
        const actMatch = headerText.match(/Act (\d+)/)
        if (actMatch) {
          currentChapter = Number.parseInt(actMatch[1], 10)
        }
      }
      return // Skip header rows
    }

    // Skip the table header row with Location, XP Reward, Name, Description
    if ($row.find('th').length > 0 && !$row.find('th[colspan]').length && $row.find('td').length === 0) {
      return
    }

    // Process data rows - handle mixed th/td structure
    const cells = $row.find('th, td')
    if (cells.length === 4) {
      // First cell could be th or td (location) - use HTML content for links
      const locationHtml = $(cells[0]).html() || ''
      const location = htmlToMarkdown(locationHtml)

      const xpText = normalizeText($row.find('td:nth-child(2)'))
      const name = normalizeText($row.find('td:nth-child(3)'))

      // Description cell - use HTML content for links
      const descriptionHtml = $(cells[3]).html() || ''
      const description = htmlToMarkdown(descriptionHtml)

      // Parse XP value
      const xp = Number.parseInt(xpText, 10)

      if (location && !Number.isNaN(xp) && name && description) {
        const goal: BackgroundGoal = {
          location,
          xp,
          name,
          description,
        }

        // Add chapter if we're not in General section
        if (currentChapter !== undefined) {
          goal.chapter = currentChapter
        }

        goals.push(goal)
      }
    }
  })

  return goals
}

export async function fetchBackgroundGoals(): Promise<Record<string, BackgroundGoal[]>> {
  const results: Record<string, BackgroundGoal[]> = {}
  for (const background of BACKGROUNDS) {
    const backgroundGoals = await _fetchBackgroundGoals(background)
    results[background] = backgroundGoals
  }
  return results
}
