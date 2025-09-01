import type { Container } from '../types'
import { SCRAPERS_INFO } from '.'
import { load, normalizeText, parseList, request } from '../utils'

export async function fetchContainers() {
  const { data } = await request.get(SCRAPERS_INFO.containers.url)
  const $ = load(data)

  const containers: Container[] = []
  let containerType: string

  $('h3, dl').each((_, element) => {
    const $element = $(element)
    if ($element.is('h3')) {
      containerType = normalizeText($element.find('.mw-headline'))
    }
    if ($element.is('dl')) {
      parseList($, $element, (_, data) => {
        const { name, image } = data
        containers.push({
          name,
          image,
          containerType,
        })
      })
    }
  })

  return containers
}
