import type { Handwear } from '../types'
import { SCRAPERS_INFO } from '.'
import { fetchEquipment } from './equipment'

export async function fetchHandwear() {
  return await fetchEquipment<Handwear>(SCRAPERS_INFO.handwear.url)
}
