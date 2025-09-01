import type { Underwear } from '../types'
import { SCRAPERS_INFO } from '.'
import { UNDERWEAR_TYPES } from '../constants'
import { load, normalizeText, normalizeUrl, request } from '../utils'

export async function _fetchUnderwear(racial: string) {
  const { data } = await request.get(`${SCRAPERS_INFO.underwear.url}${racial}`)
  const $ = load(data)

  const underwear: Underwear[] = []
  let name: string = ''

  $('h2, .bg3wiki-tooltip-box').each((_, element) => {
    const $element = $(element)
    if ($element.is('h2')) {
      name = normalizeText($element.find('.mw-headline'))
    }
    if ($element.is('div')) {
      const image = normalizeUrl($element.find('img').attr('src') || '')

      const propertyList = $element.find('.bg3wiki-property-list')
      const properties = propertyList.find('li').toArray()
      const record: Record<string, string | number> = {}
      properties.forEach((property) => {
        const $property = $(property)
        const text = normalizeText($property)
        if (text.includes(':')) {
          const [key, value] = text.split(':')
          if (key.trim() === 'Rarity') {
            record.rare = value.trim().toLowerCase()
          }
          if (key.trim() === 'Weight') {
            record.weight = value.trim()
          }
          if (key.trim() === 'Price') {
            record.price = Number.parseInt(value.replace('gp', '').trim())
          }
        }

        if ($property.find('details')) {
          const details = $property.find('details')
          const ids = details.find('tt').toArray()
          ids.forEach((id, index) => {
            const $id = $(id)
            if (!index)
              record.uid = normalizeText($id)
            else
              record.uuid = normalizeText($id)
          })
        }
      })

      underwear.push({
        name,
        image,
        racial: racial.toLowerCase() as Underwear['racial'],
        ...record,
      } as Underwear)
    }
  })

  return underwear
}

export async function fetchUnderwear() {
  const underwear: Record<string, Underwear[]> = {}
  for (const racial of UNDERWEAR_TYPES) {
    const data = await _fetchUnderwear(racial)
    underwear[racial] = data
  }
  return underwear
}
