import type { BasePayload, CollectionSlug } from 'payload'
import categories from './categories'
import events from './events'
import news from './news'
import pages from './pages'
import reports from './reports'

class Loader {
  payload: BasePayload

  constructor(payload) {
    this.payload = payload
  }

  async loader(collection: CollectionSlug, data) {
    return this.payload.create({ collection, data })
  }

  async loadList(collection: CollectionSlug, list: any[]) {
    return Promise.all(list.map((data) => this.loader(collection, data)))
  }

  async loadCategories(siteId: number) {
    const data = categories(siteId)
    return this.loadList('categories', data)
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

  async getAndUpdatePage(siteId: number, data: { title: string }) {
    const id = await this.getPageByTitle(siteId, data.title)
    return this.updateRecordById(id, 'pages', data)
  }

  async loadPages(siteId: number) {
    const data = pages(siteId)
    return Promise.all(data.map((item) => this.getAndUpdatePage(siteId, item)))
  }

  async loadReports(siteId: number, categories) {
    const data = reports(siteId, categories)
    return this.loadList('reports', data)
  }

  async runLoading(siteId: number) {
    try {
      const categories = await this.loadCategories(siteId)
      await this.loadEvents(siteId)
      await this.loadNews(siteId)
      await this.loadPages(siteId)
      await this.loadReports(siteId, categories)
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
