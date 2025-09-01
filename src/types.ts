import type {
  ARMOUR_TYPES,
  ARROW_TYPES,
  ELIXIRS_TYPES,
  GRENADE_TYPES,
  POTIONS_TYPES,
  RARITY,
} from './constants'

export interface CommandOptions {
  include?: string[]
  exclude?: string[]
  all?: boolean
}

export type Rarity = typeof RARITY[number]

export type ArmourType = typeof ARMOUR_TYPES[number]

export type ArrowType = typeof ARROW_TYPES[number]

export type ElixirType = typeof ELIXIRS_TYPES[number]

export type GrenadeType = typeof GRENADE_TYPES[number]

export type PotionType = typeof POTIONS_TYPES[number]

export interface Position {
  x: number
  y: number
}

export interface QuestList {
  title: string
  children?: QuestList[]
  quests?: Quest[]
}

export interface Quest {
  image: string
  title: string
  chapter?: number[]
  description?: string
  subQuests?: SubQuest[]
}

export interface SubQuest {
  title: string
  link: string
}

export interface SoulCoin {
  chapter: number
  count: number
  description: string
  position?: Position
}

export interface MindFlayerParasite {
  chapter: number
  count: number
  description: string
  position?: Position
}

export interface BackgroundGoal {
  location: string
  xp: number
  name: string
  description: string
  chapter?: number
}

export interface Equipment {
  name: string
  image: string
  rare: Rarity
  weight: string
  price: number
}

export interface Amulet extends Equipment {
  effects: string
}

export interface Armour extends Equipment {
  armourType: ArmourType
  armourClass: number
  stealthDisadvantage: boolean
  special: string
}

export interface Cloak extends Equipment {
  effects: string
}

export interface Clothing extends Equipment {
  effects: string
}

export interface Footwear extends Equipment {
  armourType: ArmourType
  effects: string
}

export interface Handwear extends Equipment {
  armourType: ArmourType
  effects: string
}

export interface Headwear extends Equipment {
  armourType: ArmourType
  effects: string
}

export interface LightSource extends Omit<Equipment, 'price'> {
  glowEmitted: string
  damage: string
  description: string
  firstSeen: number
}

export interface MusicalInstrument extends Omit<Equipment, 'weight' | 'price'> {
  instrumentType: 'starting' | 'unique'
}

export interface Ring extends Equipment {
  effects: string
}

export interface Shield extends Equipment {
  armourClassBonus: string
  special: string
}

export interface Weapon extends Equipment {
  enchant: string
  damage: string
  damageType: string
  special: string
}

export interface CampClothing {
  name: string
  image: string
  clothingType:
    | 'poor'
    | 'medium'
    | 'citizen'
    | 'rich'
    | 'patriars'
    | 'aristocrat'
    | 'unsorted'
    | 'shoes'
    | 'underwear'
    | 'starting'
    | 'epilogue'
    | 'twitch'
  character?:
    | 'astarion'
    | 'gale'
    | 'halsin'
    | 'jaheira'
    | `lae'zel`
    | 'minsc'
    | 'minthara'
    | 'karlach'
    | 'shadowheart'
    | 'wyll'
    | 'durge'
    | 'tav'
}

export interface Underwear {
  name: string
  image: string
  racial:
    | 'dragonborn'
    | 'drow'
    | 'dwarf'
    | 'elf'
    | 'githyanki'
    | 'gnome'
    | 'half-elf'
    | 'half-orc'
    | 'halfling'
    | 'human'
    | 'incubus'
    | 'tiefling'
  rare: Rarity
  weight: string
  price: number
  uid: string
  uuid: string
}

export type Consumable = Omit<Equipment, 'weight'>

export interface Arrow extends Omit<Consumable, 'price'> {
  arrowType: ArrowType
  price?: number
  tradeLevel?: number
  type?: string
  effect?: string
}

export interface CampSupplies {
  name: string
  image: string
  campSupplies?: number
}

export interface Coatings extends Consumable {
  ingredientName?: string
  ingredientImage?: string
  tradeLevel: number
  throwable: boolean
  dc?: number
  effect: string
}

export interface Dye extends Omit<Consumable, 'price'> {

}

export interface Elixir extends Consumable {
  elixirType: ElixirType
  ingredientName?: string
  ingredientImage?: string
  raceName?: string
  raceImage?: string
  tradeLevel?: number
  throwable: boolean
  effect: string
}

export interface Grenade extends Omit<Consumable, 'price'> {
  price?: number
  aoe?: string
  craftable: boolean
  soldBy?: string
  effect?: string
  type?: string
  grenadeType?: GrenadeType
}

export interface Potion extends Omit<Consumable, 'price'> {
  price?: number
  potionType: PotionType
  ingredientName?: string
  ingredientImage?: string
  tradeLevel?: number
  throwable?: boolean
  duration?: string
  effect?: string
}

export interface Scroll {
  name: string
  image: string
  level: number
  limitType?: 'trader' | 'limited' | 'unique'
}

export interface Spell {
  name: string
  image: string
  cantrip?: boolean
  level?: number
}

export interface Book {
  name: string
  image: string
  rare: Rarity
}

export interface Container {
  name: string
  image: string
  containerType: string
}

export type Note = Book

export interface Miscellaneous {
  name: string
  image: string
  miscellaneousType: 'interactive' | 'consumables' | 'clutter'
}

export interface StoryItem {
  name: string
  image: string
  chapter?: number
}

export interface Key {
  name: string
  image: string
  chapter: number
}

export interface Valuable {
  name: string
  image: string
  valuableType: 'currency' | 'ingots' | 'gemstones' | 'paintings' | 'valuable clutter'
}
