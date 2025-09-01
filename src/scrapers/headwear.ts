import type { Headwear } from '../types'
import { SCRAPERS_INFO } from '.'
import { fetchEquipment } from './equipment'

export async function fetchHeadwear() {
  return await fetchEquipment<Headwear>(SCRAPERS_INFO.headwear.url)
}
