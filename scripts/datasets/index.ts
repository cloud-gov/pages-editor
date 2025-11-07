import type { BasePayload, CollectionSlug } from 'payload'
import categories from './categories'
import events from './events'
import leadership from './leadership'
import news from './news'
import pages from './pages'
import reports from './reports'
import resources from './resources'
import homePage from './homePage'
import menu from './menu'
import sideNavigation from './sideNavigation'

class Loader {
  payload: BasePayload

  constructor(payload) {
    this.payload = payload
  }

  /**
   * Clean data for Payload operations by converting relationship objects to IDs
   * This handles cases where exported data includes full relationship objects
   */
  cleanDataForPayload(data: any): any {
    if (data === null || data === undefined) {
      return data
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.cleanDataForPayload(item))
    }

    if (typeof data === 'object') {
      // Known relationship field names that should be converted to IDs
      const relationshipFields = ['bgImage', 'image', 'page', 'media', 'site']
      
      // If object has an 'id' property and looks like a relationship object, return just the ID
      if ('id' in data && typeof data.id === 'number') {
        const keys = Object.keys(data)
        // If it has many properties (more than just id), it's likely a full relationship object
        // Check for common relationship object properties
        if (keys.length > 3 || keys.some(k => ['altText', 'filename', 'mimeType', 'filesize', 'width', 'height', 'focalX', 'focalY', 'createdAt', 'updatedAt'].includes(k))) {
          return data.id
        }
      }

      // Recursively clean nested objects
      const cleaned: any = {}
      for (const [key, value] of Object.entries(data)) {
        // Skip block IDs in content blocks (string IDs)
        if (key === 'id' && typeof value === 'string') {
          // Keep block IDs as they're needed for content blocks
          cleaned[key] = value
          continue
        }
        
        // Handle relationship fields - convert objects to IDs
        if (relationshipFields.includes(key) && value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
          cleaned[key] = value.id
          continue
        }
        
        cleaned[key] = this.cleanDataForPayload(value)
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

  async loadLeadership(siteId: number) {
    const data = leadership(siteId)
    return this.loadList('leadership', data)
  }

  async loadReports(siteId: number, categories) {
    const data = reports(siteId, categories)
    return this.loadList('reports', data)
  }

  async loadResources(siteId: number, categories) {
    const data = resources(siteId, categories)
    return this.loadList('resources', data)
  }

  async loadHomePage(siteId: number) {
    const rawData = homePage()
    // Clean the data to convert relationship objects to IDs
    const data = this.cleanDataForPayload(rawData)
    
    // Check if home page global already exists for this site
    const existing = await this.payload.find({
      collection: 'home-page-site-collection',
      where: {
        site: { equals: siteId },
      },
    })

    if (existing.docs.length > 0) {
      // Update existing home page
      return await this.payload.update({
        collection: 'home-page-site-collection',
        id: existing.docs[0].id,
        data: {
          ...data,
          site: siteId,
          _status: 'published',
        } as any,
      })
    } else {
      // Create new home page
      return await this.payload.create({
        collection: 'home-page-site-collection',
        data: {
          ...data,
          site: siteId,
          _status: 'published',
        } as any,
      })
    }
  }

  async loadMenu(siteId: number) {
    const rawData = menu()
    // Clean the data first
    const data = this.cleanDataForPayload(rawData)
    
    // Resolve page relationships in menu items
    const resolvedItems = await Promise.all(
      (data.items || []).map(async (item: any) => {
        if (item.blockType === 'pageLink' && item.pageLabel) {
          // Try to find the page by label/title
          try {
            const pageId = await this.getPageByTitle(siteId, item.pageLabel)
            return {
              ...item,
              page: pageId,
            }
          } catch (error) {
            console.warn(`Page "${item.pageLabel}" not found, skipping menu item`)
            return null
          }
        }
        // If page is already an object with id, convert to just ID
        if (item.blockType === 'pageLink' && item.page && typeof item.page === 'object' && item.page.id) {
          return {
            ...item,
            page: item.page.id,
          }
        }
        return item
      }),
    )

    const menuData = {
      items: resolvedItems.filter((item) => item !== null),
    }

    // Check if menu already exists for this site
    const existing = await this.payload.find({
      collection: 'menu-site-collection',
      where: {
        site: { equals: siteId },
      },
    })

    if (existing.docs.length > 0) {
      return await this.payload.update({
        collection: 'menu-site-collection',
        id: existing.docs[0].id,
        data: {
          ...menuData,
          site: siteId,
          _status: 'published',
        } as any,
      })
    } else {
      return await this.payload.create({
        collection: 'menu-site-collection',
        data: {
          ...menuData,
          site: siteId,
          _status: 'published',
        } as any,
      })
    }
  }

  async loadSideNavigation(siteId: number) {
    const rawData = sideNavigation()
    // Clean the data first
    const data = this.cleanDataForPayload(rawData)
    
    // Resolve page relationships in side navigation items
    const resolveItems = async (items: any[]): Promise<any[]> => {
      return Promise.all(
        (items || []).map(async (item: any) => {
          if (item.blockType === 'pageLink' && item.pageLabel) {
            try {
              const pageId = await this.getPageByTitle(siteId, item.pageLabel)
              return {
                ...item,
                page: pageId,
              }
            } catch (error) {
              console.warn(`Page "${item.pageLabel}" not found, skipping side nav item`)
              return null
            }
          }
          // If page is already an object with id, convert to just ID
          if (item.blockType === 'pageLink' && item.page && typeof item.page === 'object' && item.page.id) {
            return {
              ...item,
              page: item.page.id,
            }
          }
          if (item.subitems) {
            return {
              ...item,
              subitems: await resolveItems(item.subitems),
            }
          }
          return item
        }),
      )
    }

    const resolvedItems = await resolveItems(data.items || [])
    const sideNavData = {
      ...data,
      items: resolvedItems.filter((item) => item !== null),
    }

    // Check if side navigation already exists for this site
    const existing = await this.payload.find({
      collection: 'side-navigation-site-collection',
      where: {
        site: { equals: siteId },
      },
    })

    if (existing.docs.length > 0) {
      return await this.payload.update({
        collection: 'side-navigation-site-collection',
        id: existing.docs[0].id,
        data: {
          ...sideNavData,
          site: siteId,
          _status: 'published',
        } as any,
      })
    } else {
      return await this.payload.create({
        collection: 'side-navigation-site-collection',
        data: {
          ...sideNavData,
          site: siteId,
          _status: 'published',
        } as any,
      })
    }
  }

  async runLoading(siteId: number) {
    try {
      const categories = await this.loadCategories(siteId)
      await this.loadEvents(siteId)
      await this.loadLeadership(siteId)
      await this.loadNews(siteId)
      await this.loadPages(siteId)
      await this.loadReports(siteId, categories)
      await this.loadResources(siteId, categories)
      await this.loadHomePage(siteId)
      await this.loadMenu(siteId)
      await this.loadSideNavigation(siteId)
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
