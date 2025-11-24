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
        if ((key === 'bgImage' || key === 'image') && value && typeof value === 'object' && 'filename' in value) {
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
              console.warn(`Media file "${value.filename}" not found for site ${siteId}, setting to null`)
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
    // Resolve media references by filename for the current site
    const dataWithMedia = await this.resolveMediaReferences(siteId, rawData)
    // Clean the data to convert relationship objects to IDs
    const data = this.cleanDataForPayload(dataWithMedia)
    
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
    
    // Resolve page relationships in menu items
    const resolveItems = async (items: any[]): Promise<any[]> => {
      return Promise.all(
        (items || []).map(async (item: any) => {
          // Handle pageLink blocks - resolve by title from page object
          if (item.blockType === 'pageLink' && item.page) {
            if (typeof item.page === 'object' && item.page.title) {
              // Page object has title, resolve by title
              try {
                const pageId = await this.getPageByTitle(siteId, item.page.title)
                return {
                  ...item,
                  page: pageId,
                }
              } catch (error) {
                console.warn(`Page "${item.page.title}" not found for site ${siteId}, skipping menu item`)
                return null
              }
            } else if (typeof item.page === 'object' && item.page.id) {
              // Page object has id, but it's from another site - try to resolve by slug if available
              if (item.page.slug) {
                const pageId = await this.getPageBySlug(siteId, item.page.slug)
                if (pageId) {
                  return {
                    ...item,
                    page: pageId,
                  }
                }
              }
              console.warn(`Page with ID ${item.page.id} not found for site ${siteId}, skipping menu item`)
              return null
            }
          }
          
          // Handle dropdown blocks with subitems
          if (item.blockType === 'dropdown' && item.subitems) {
            return {
              ...item,
              subitems: await resolveItems(item.subitems),
            }
          }
          
          // Handle collectionLink and customCollectionLink - these don't need resolution
          return item
        }),
      )
    }
    
    const resolvedItems = await resolveItems(rawData.items || [])
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
    
    // Resolve page relationships in side navigation items
    const resolveItems = async (items: any[]): Promise<any[]> => {
      return Promise.all(
        (items || []).map(async (item: any) => {
          // Handle pageLink blocks - resolve by title from page object
          if (item.blockType === 'pageLink' && item.page) {
            if (typeof item.page === 'object' && item.page.title) {
              // Page object has title, resolve by title
              try {
                const pageId = await this.getPageByTitle(siteId, item.page.title)
                return {
                  ...item,
                  page: pageId,
                }
              } catch (error) {
                console.warn(`Page "${item.page.title}" not found for site ${siteId}, skipping side nav item`)
                return null
              }
            } else if (typeof item.page === 'object' && item.page.id) {
              // Page object has id, but it's from another site - try to resolve by slug if available
              if (item.page.slug) {
                const pageId = await this.getPageBySlug(siteId, item.page.slug)
                if (pageId) {
                  return {
                    ...item,
                    page: pageId,
                  }
                }
              }
              console.warn(`Page with ID ${item.page.id} not found for site ${siteId}, skipping side nav item`)
              return null
            }
          }
          
          // Handle subitems recursively
          if (item.subitems) {
            return {
              ...item,
              subitems: await resolveItems(item.subitems),
            }
          }
          
          // Handle collectionLink and customCollectionLink - these don't need resolution
          return item
        }),
      )
    }

    const resolvedItems = await resolveItems(rawData.items || [])
    const sideNavData = {
      ...rawData,
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
