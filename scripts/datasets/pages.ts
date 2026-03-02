import { Page } from '@/payload-types'
import { createContent, generateRandomTitle, generateRandomInt } from './utils'

const content = createContent()

const pages = (siteId: number): Page[] => {
  const pageEntry = (title: string): Page => {
    return {
      id: generateRandomInt(),
      title,
      site: siteId,
      // @ts-ignore
      content,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      _status: 'published',
    }
  }
  return [
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
    pageEntry(generateRandomTitle()),
  ]
}

export default pages
