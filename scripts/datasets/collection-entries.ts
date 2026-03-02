import { CollectionEntry, CollectionType, Tag } from '@/payload-types'
import { createContent, generateRandomTitle, generateRandomInt } from './utils'

const content = createContent()

const collectionEntries = (
  siteId: number,
  collectionType: CollectionType,
  tags: Tag[],
): CollectionEntry[] => {
  const collectionEntry = (title: string): CollectionEntry => {
    return {
      id: generateRandomInt(),
      title,
      site: siteId,
      // @ts-ignore
      content,
      tags,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      collectionType: collectionType.id,
      _status: 'published',
    }
  }
  return [
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
    collectionEntry(generateRandomTitle()),
  ]
}

export default collectionEntries
