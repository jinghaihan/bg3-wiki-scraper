import type { Footwear } from '../types'
import { SCRAPERS_INFO } from '.'
import { fetchEquipment } from './equipment'

export async function fetchFootwear() {
  return await fetchEquipment<Footwear>(SCRAPERS_INFO.footwear.url)
}
