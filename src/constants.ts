import type { Rarity } from './types'
import { fileURLToPath } from 'node:url'

export const PKG_ROOT = fileURLToPath(new URL('..', import.meta.url))

export const OUTPUT_DIR = `${PKG_ROOT}/output/`

export const BASE_URL = 'https://bg3.wiki'

export const CHAPTERS: string[] = ['Act One', 'Act Two', 'Act Three']

export const BACKGROUNDS: string[] = [
  'Acolyte',
  'Charlatan',
  'Criminal',
  'Entertainer',
  'Folk Hero',
  'Guild Artisan',
  'Haunted One',
  'Noble',
  'Outlander',
  'Sage',
  'Soldier',
  'Urchin',
]

export const RARITY = [
  'common',
  'uncommon',
  'rare',
  'very rare',
  'legendary',
  'story item',
] as const

export const ARMOUR_TYPES = [
  'non armour',
  'light armour',
  'medium armour',
  'heavy armour',
] as const

export const RARITY_COLOR_MAPS: Record<string, Rarity> = {
  '#FFFFFF': 'common',
  '#01BD39': 'uncommon',
  '#01BFFF': 'rare',
  '#D1017B': 'very rare',
  '#B7861D': 'legendary',
  '#FF5901': 'story item',
}

export const WEAPON_TYPES = [
  'Battleaxes',
  'Clubs',
  'Daggers',
  'Flails',
  'Glaives',
  'Greataxes',
  'Greatclubs',
  'Greatswords',
  'Halberds',
  'Hand_Crossbows',
  'Handaxes',
  'Heavy_Crossbows',
  'Javelins',
  'Light_Crossbows',
  'Light_Hammers',
  'Longbows',
  'Longswords',
  'Maces',
  'Mauls',
  'Morningstars',
  'Pikes',
  'Quarterstaves',
  'Rapiers',
  'Scimitars',
  'Shortbows',
  'Shortswords',
  'Sickles',
  'Spears',
  'Tridents',
  'War_Picks',
  'Warhammers',
]

export const UNDERWEAR_TYPES = [
  'Dragonborn',
  'Drow',
  'Dwarf',
  'Elf',
  'Githyanki',
  'Gnome',
  'Half-Elf',
  'Half-Orc',
  'Halfling',
  'Human',
  'Incubus',
  'Tiefling',
]

export const ARROW_TYPES = [
  'regular',
  'special',
  'unusable',
  'unavailable',
] as const

export const ELIXIRS_TYPES = [
  'cultivation',
  'resistance',
  'strength',
  'other',
  'unique',
] as const

export const GRENADE_TYPES = [
  'regular',
  'explosive satchels',
  'special',
  'other',
] as const

export const POTIONS_TYPES = [
  'healing',
  'regular',
  'hag',
  'drugs',
  'unique',
  'legacy',
] as const
