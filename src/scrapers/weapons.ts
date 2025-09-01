import type { Weapon } from '../types'
import { SCRAPERS_INFO } from '.'
import { WEAPON_TYPES } from '../constants'
import { htmlToMarkdown, load, normalizeText, parseTable, request } from '../utils'

export async function fetchWeapon(weapon: string) {
  const { data } = await request(`${SCRAPERS_INFO.weapons.url}${weapon}`)
  const $ = load(data)

  const weapons: Weapon[] = []

  $('.wikitable').each((_, table) => {
    const $table = $(table)
    parseTable($, $table, ($row, data) => {
      const { name, image, rare } = data
      const enchant = normalizeText($row.find('td:nth-child(2)'))
      const damage = normalizeText($row.find('td:nth-child(3)'))
      const damageType = normalizeText($row.find('td:nth-child(4)'))
      const weight = normalizeText($row.find('td:nth-child(5)'))
      const price = normalizeText($row.find('td:nth-child(6)'))
      const special = htmlToMarkdown($row.find('td:nth-child(7)').html() || '')

      weapons.push({
        name,
        image,
        rare,
        enchant,
        damage,
        damageType,
        weight,
        price: Number.parseInt(price),
        special,
      })
    })
  })

  return weapons
}

export async function fetchWeapons() {
  const results: Record<string, Weapon[]> = {}
  for (const weapon of WEAPON_TYPES) {
    const data = await fetchWeapon(weapon)
    results[weapon] = data
  }
  return results
}
