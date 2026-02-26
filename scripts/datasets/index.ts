import type { BasePayload, CollectionSlug } from 'payload'
import type { CollectionType, Tag } from '@/payload-types'
import collectionEntries from './collection-entries'
import collectionTypes from './collection-types'
import tags from './tags'
import pages from './pages'

class Loader {
  payload: BasePayload

  constructor(payload) {
    this.payload = payload
  }

  _randomNumberOfArrayItems(items: any[], numberOfItems: number): any[] {
    if (!Array.isArray(items) || items.length === 0) return []
    if (!Number.isInteger(numberOfItems) || numberOfItems <= 0) return []
    if (numberOfItems >= items.length) return items

    const arr = items.slice()
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, numberOfItems)
  }

  async loader(collection: CollectionSlug, data) {
    return this.payload.create({ collection, data })
  }

  async loadList(collection: CollectionSlug, list: any[]) {
    return Promise.all(list.map((data) => this.loader(collection, data)))
  }

  async loadtags(siteId: number) {
    const data = tags(siteId)
    return this.loadList('tags', data)
  }

  async loadCollectionTypes(siteId: number) {
    const data = collectionTypes(siteId)
    return this.loadList('collection-types', data)
  }

  async loadCollectionEntries(siteId: number, collectionTypes: CollectionType[], tags: Tag[]) {
    const tagAmounts = [1, 2, 3]
    const data = collectionTypes
      .map((collectionType) => {
        return tagAmounts
          .map((amount) => {
            const selectedTags: Tag[] | null = this._randomNumberOfArrayItems(tags, amount)
            return collectionEntries(siteId, collectionType, selectedTags)
          })
          .flat()
      })
      .flat()

    return this.loadList('collection-entries', data)
  }

  async loadPages(siteId: number) {
    const data = pages(siteId)
    return this.loadList('pages', data)
  }

  async runLoading(siteId: number) {
    try {
      const tags = await this.loadtags(siteId)
      const collectionTypes = await this.loadCollectionTypes(siteId)
      // @ts-ignore
      await this.loadCollectionEntries(siteId, collectionTypes, tags)
      await this.loadPages(siteId)
    } catch (error) {
      console.error(`\nError occurred during dataset load for site ${siteId}...`)
      console.error(error.message)
      console.log('\n')
    }
  }

  async updateRecordById(id: number, collection: CollectionSlug, data) {
    return await this.payload.update({ collection, id, data })
  }
}

export default Loader
