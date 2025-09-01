import { BASE_URL } from '../constants'
import { fetchAmulets } from './amulets'
import { fetchArmour } from './armour'
import { fetchArrows } from './arrows'
import { fetchBackgroundGoals } from './backgrounds'
import { fetchBooks } from './books'
import { fetchCampClothing } from './camp-clothing'
import { fetchCampSupplies } from './camp-supplies'
import { fetchCloaks } from './cloaks'
import { fetchClothing } from './clothing'
import { fetchCoatings } from './coatings'
import { fetchContainers } from './containers'
import { fetchDyes } from './dyes'
import { fetchElixirs } from './elixirs'
import { fetchFootwear } from './footwear'
import { fetchGrenades } from './grenades'
import { fetchHandwear } from './handwear'
import { fetchHeadwear } from './headwear'
import { fetchKeys } from './keys'
import { fetchLightSources } from './light-sources'
import { fetchMindFlayerParasite } from './mind-flayer-parasite'
import { fetchMiscellaneous } from './miscellaneous'
import { fetchMusicalInstruments } from './musical-instruments'
import { fetchNotes } from './notes'
import { fetchPotions } from './potions'
import { fetchQuests } from './quests'
import { fetchRings } from './rings'
import { fetchScrolls } from './scrolls'
import { fetchShields } from './shields'
import { fetchSoulCoin } from './soul-coin'
import { fetchSpells } from './spells'
import { fetchStoryItems } from './story-items'
import { fetchUnderwear } from './underwear'
import { fetchValuables } from './valuables'
import { fetchWeapons } from './weapons'

export const SCRAPERS_INFO = {
  'quests': {
    url: `${BASE_URL}/wiki/Quests`,
    scraper: () => fetchQuests(),
  },
  'soul-coin': {
    url: `${BASE_URL}/wiki/Soul_Coin`,
    scraper: () => fetchSoulCoin(),
  },
  'mind-flayer-parasite': {
    url: `${BASE_URL}/wiki/Illithid_powers`,
    scraper: () => fetchMindFlayerParasite(),
  },
  'backgrounds': {
    url: `${BASE_URL}/wiki/`,
    scraper: () => fetchBackgroundGoals(),
  },
  'amulets': {
    url: `${BASE_URL}/wiki/Amulets`,
    scraper: () => fetchAmulets(),
  },
  'armour': {
    url: `${BASE_URL}/wiki/Armour`,
    scraper: () => fetchArmour(),
  },
  'cloaks': {
    url: `${BASE_URL}/wiki/Cloaks`,
    scraper: () => fetchCloaks(),
  },
  'clothing': {
    url: `${BASE_URL}/wiki/Clothing`,
    scraper: () => fetchClothing(),
  },
  'footwear': {
    url: `${BASE_URL}/wiki/Footwear`,
    scraper: () => fetchFootwear(),
  },
  'handwear': {
    url: `${BASE_URL}/wiki/Handwear`,
    scraper: () => fetchHandwear(),
  },
  'headwear': {
    url: `${BASE_URL}/wiki/Headwear`,
    scraper: () => fetchHeadwear(),
  },
  'light-sources': {
    url: `${BASE_URL}/wiki/Light_Sources`,
    scraper: () => fetchLightSources(),
  },
  'musical-instruments': {
    url: `${BASE_URL}/wiki/Musical_Instruments`,
    scraper: () => fetchMusicalInstruments(),
  },
  'rings': {
    url: `${BASE_URL}/wiki/Rings`,
    scraper: () => fetchRings(),
  },
  'shields': {
    url: `${BASE_URL}/wiki/Shields`,
    scraper: () => fetchShields(),
  },
  'weapons': {
    url: `${BASE_URL}/wiki/`,
    scraper: () => fetchWeapons(),
  },
  'camp-clothing': {
    url: `${BASE_URL}/wiki/Camp_Clothing`,
    scraper: () => fetchCampClothing(),
  },
  'underwear': {
    url: `${BASE_URL}/wiki/Underwear/`,
    scraper: () => fetchUnderwear(),
  },
  'arrows': {
    url: `${BASE_URL}/wiki/Arrows`,
    scraper: () => fetchArrows(),
  },
  'camp-supplies': {
    url: `${BASE_URL}/wiki/Camp_Supplies`,
    scraper: () => fetchCampSupplies(),
  },
  'coatings': {
    url: `${BASE_URL}/wiki/Coatings`,
    scraper: () => fetchCoatings(),
  },
  'dyes': {
    url: `${BASE_URL}/wiki/Dyes`,
    scraper: () => fetchDyes(),
  },
  'elixirs': {
    url: `${BASE_URL}/wiki/Elixirs`,
    scraper: () => fetchElixirs(),
  },
  'grenades': {
    url: `${BASE_URL}/wiki/Grenades`,
    scraper: () => fetchGrenades(),
  },
  'potions': {
    url: `${BASE_URL}/wiki/Potions`,
    scraper: () => fetchPotions(),
  },
  'scrolls': {
    url: `${BASE_URL}/wiki/Scrolls`,
    scraper: () => fetchScrolls(),
  },
  'spells': {
    url: `${BASE_URL}/wiki/Scrolls`,
    scraper: () => fetchSpells(),
  },
  'books': {
    url: `${BASE_URL}/wiki/Books`,
    scraper: () => fetchBooks(),
  },
  'containers': {
    url: `${BASE_URL}/wiki/Containers`,
    scraper: () => fetchContainers(),
  },
  'notes': {
    url: `${BASE_URL}/wiki/Notes`,
    scraper: () => fetchNotes(),
  },
  'miscellaneous': {
    url: `${BASE_URL}/wiki/Miscellaneous`,
    scraper: () => fetchMiscellaneous(),
  },
  'story-items': {
    url: `${BASE_URL}/wiki/Story_Items`,
    scraper: () => fetchStoryItems(),
  },
  'keys': {
    url: `${BASE_URL}/wiki/Story_Items`,
    scraper: () => fetchKeys(),
  },
  'valuables': {
    url: `${BASE_URL}/wiki/Valuables`,
    scraper: () => fetchValuables(),
  },
}
