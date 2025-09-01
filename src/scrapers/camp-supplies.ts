import type { CampSupplies } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeText, parseList, request } from '../utils'

export async function fetchCampSupplies() {
  const { data } = await request.get(SCRAPERS_INFO['camp-supplies'].url)
  const $ = load(data)

  const campSupplies: CampSupplies[] = []
  const uniq = (name: string) => {
    const index = campSupplies.findIndex(item => item.name === name)
    if (index !== -1) {
      campSupplies.splice(index, 1)
    }
  }

  $('ul').each((_, element) => {
    const $element = $(element)
    parseList($, $element, (li, data) => {
      const { name, image } = data

      const text = normalizeText(li.last())
      const supplies = text.match(/\(\s*(\d+)\s*\)/)?.[1]
      if (supplies) {
        uniq(name)
        campSupplies.push({
          name,
          image,
          campSupplies: Number.parseInt(supplies),
        })
      }
      else {
        if (text.includes('hit points')) {
          uniq(name)
          campSupplies.push({
            name,
            image,
          })
        }
      }
    })
  })

  return campSupplies
}
