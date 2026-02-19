import type { BasePayload, CollectionSlug } from 'payload'
import tags from './tags'
import events from './events'
import leadership from './leadership'
import news from './news'
import pages from './pages'
import reports from './reports'
import resources from './resources'

class Loader {
  payload: BasePayload

  constructor(payload) {
    this.payload = payload
  }

  /**
   * Clean data for Payload operations by converting relationship objects to IDs
   * This handles cases where exported data includes full relationship objects
   */
  cleanDataForPayload(data: any, isBlockItem: boolean = false): any {
    if (data === null || data === undefined) {
      return data
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.cleanDataForPayload(item, isBlockItem))
    }

    if (typeof data === 'object') {
      // Known relationship field names that should be converted to IDs
      const relationshipFields = ['bgImage', 'image', 'page', 'media', 'site', 'customCollection']

      // If object has an 'id' property and looks like a relationship object, return just the ID
      if ('id' in data && typeof data.id === 'number') {
        const keys = Object.keys(data)
        // If it has many properties (more than just id), it's likely a full relationship object
        // Check for common relationship object properties
        if (
          keys.length > 3 ||
          keys.some((k) =>
            [
              'altText',
              'filename',
              'mimeType',
              'filesize',
              'width',
              'height',
              'focalX',
              'focalY',
              'createdAt',
              'updatedAt',
            ].includes(k),
          )
        ) {
          return data.id
        }
      }

      // Recursively clean nested objects
      const cleaned: any = {}
      for (const [key, value] of Object.entries(data)) {
        // Remove block IDs - Payload will generate them automatically
        // This prevents "invalid id" errors when Payload doesn't expect the id field
        if (key === 'id' && typeof value === 'string') {
          // Skip block IDs - Payload will generate new ones automatically
          continue
        }

        // Handle relationship fields - convert objects to IDs
        if (
          relationshipFields.includes(key) &&
          value &&
          typeof value === 'object' &&
          'id' in value &&
          typeof value.id === 'number'
        ) {
          cleaned[key] = value.id
          continue
        }

        // Recursively clean, marking block items when we encounter blockType
        const isNestedBlockItem =
          isBlockItem ||
          key === 'items' ||
          key === 'subitems' ||
          (key === 'blocks' && Array.isArray(value))
        cleaned[key] = this.cleanDataForPayload(value, isNestedBlockItem)
      }
      return cleaned
    }

    return data
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

  async loadEvents(siteId: number) {
    const data = events(siteId)
    return this.loadList('events', data)
  }

  async loadNews(siteId: number) {
    const data = news(siteId)
    return this.loadList('news', data)
  }

  async getPageByTitle(siteId: number, title: string): Promise<number> {
    const data = await this.payload.find({
      collection: 'pages',
      where: {
        site: { equals: siteId },
        title: { equals: title },
      },
    })

    if (data.docs.length === 0) {
      throw Error(`Page ${title} does not exist.`)
    }

    return data.docs[0].id
  }

  async getPageBySlug(siteId: number, slug: string): Promise<number | null> {
    const data = await this.payload.find({
      collection: 'pages',
      where: {
        site: { equals: siteId },
        slug: { equals: slug },
      },
    })

    if (data.docs.length === 0) {
      return null
    }

    return data.docs[0].id
  }

  async resolveMediaReferences(siteId: number, data: any): Promise<any> {
    if (data === null || data === undefined) {
      return data
    }

    if (Array.isArray(data)) {
      return Promise.all(data.map((item) => this.resolveMediaReferences(siteId, item)))
    }

    if (typeof data === 'object') {
      const resolved: any = {}

      for (const [key, value] of Object.entries(data)) {
        // Handle media references (bgImage, image)
        if (
          (key === 'bgImage' || key === 'image') &&
          value &&
          typeof value === 'object' &&
          'filename' in value
        ) {
          try {
            const mediaData = await this.payload.find({
              collection: 'media',
              where: {
                site: { equals: siteId },
                filename: { equals: value.filename },
              },
              limit: 1,
            })

            if (mediaData.docs.length > 0) {
              resolved[key] = mediaData.docs[0].id
            } else {
              console.warn(
                `Media file "${value.filename}" not found for site ${siteId}, setting to null`,
              )
              resolved[key] = null
            }
          } catch (error) {
            console.warn(`Error resolving media "${value.filename}":`, error)
            resolved[key] = null
          }
        } else {
          resolved[key] = await this.resolveMediaReferences(siteId, value)
        }
      }

      return resolved
    }

    return data
  }

  async getAndUpdatePage(siteId: number, data: { title: string }) {
    const id = await this.getPageByTitle(siteId, data.title)
    return this.updateRecordById(id, 'pages', data)
  }

  async loadPages(siteId: number) {
    const data = pages(siteId)
    return Promise.all(data.map((item) => this.getAndUpdatePage(siteId, item)))
  }

  async loadLeadership(siteId: number) {
    const data = leadership(siteId)
    return this.loadList('leadership', data)
  }

  async loadReports(siteId: number, tags) {
    const data = reports(siteId, tags)
    return this.loadList('reports', data)
  }

  async loadResources(siteId: number, tags) {
    const data = resources(siteId, tags)
    return this.loadList('resources', data)
  }

  async runLoading(siteId: number) {
    try {
      const tags = await this.loadtags(siteId)
      await this.loadEvents(siteId)
      await this.loadLeadership(siteId)
      await this.loadNews(siteId)
      await this.loadPages(siteId)
      await this.loadReports(siteId, tags)
      await this.loadResources(siteId, tags)
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
