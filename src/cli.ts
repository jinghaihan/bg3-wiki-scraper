import type { CAC } from 'cac'
import type { CommandOptions } from './types'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { version } from '../package.json'
import { OUTPUT_DIR } from './constants'
import { SCRAPERS_INFO } from './scrapers'
import { executeWithConcurrency } from './utils'

async function normalizeOptions(options: CommandOptions) {
  options.include ??= []
  options.exclude ??= []

  const scrapers = Object.keys(SCRAPERS_INFO).sort((a, b) => a.localeCompare(b))
  if (!options.include!.length && !options.exclude!.length) {
    const result = await p.multiselect({
      message: 'Select the data types to scrape',
      options: scrapers.map(range => ({
        label: range,
        value: range,
      })),
      initialValues: options.all ? scrapers : undefined,
    })
    if (p.isCancel(result)) {
      process.exit(1)
    }
    options.include = result
  }

  const types = scrapers.filter((range) => {
    if (options.exclude!.includes(range))
      return false
    if (options.include!.length > 0 && !options.include!.includes(range))
      return false
    return true
  })

  return types
}

try {
  const cli: CAC = cac('termsnap')
  cli
    .command('')
    .option('--include <type>', 'Include specific data types')
    .option('--exclude <type>', 'Exclude specific data types')
    .option('--all', 'Scrape all data types')
    .action(async (options: CommandOptions) => {
      const types = await normalizeOptions(options)

      const tasks = types.map(range => async () => {
        const scraper = SCRAPERS_INFO[range as keyof typeof SCRAPERS_INFO].scraper
        const spinner = p.spinner()

        try {
          spinner.start(`Scraping ${c.yellow(range)}...`)
          const result = await scraper()
          spinner.stop(`${c.green('✓')} Finished scraping ${c.yellow(range)}...`)
          return result
        }
        catch (error) {
          spinner.stop(`${c.red('✗')} Failed to scrape ${c.yellow(range)}: ${error instanceof Error ? error.message : String(error)}`)
          console.error(error)
          return undefined
        }
      })

      const data = await executeWithConcurrency(tasks, 3)

      await Promise.all(
        types.map(async (range, index) => {
          if (data[index]) {
            await writeFile(
              resolve(OUTPUT_DIR, `${range}.json`),
              JSON.stringify(data[index], null, 2),
            )
          }
        }),
      )
    })

  cli.help()
  cli.version(version)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
