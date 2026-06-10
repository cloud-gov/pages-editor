import type { BasePayload, CollectionSlug } from 'payload'
import type { CollectionType, Tag, SiteForm } from '@/payload-types'
import collectionEntries from './collection-entries'
import collectionTypes from './collection-types'
import tags from './tags'
import pages from './pages'
import publishedBuildStatus from './published-build-status'
import forms from './forms'
import formSubmissions from './form-submissions'

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

  async loadPublishedBuildStatus(siteId: number){
    const data = publishedBuildStatus(siteId)
    return this.loadList('published-build-status', data)
  }

  async loadForms(siteId: number): Promise<SiteForm[]> {
    const data = forms(siteId)
    // Use overrideAccess and disable hooks to bypass access control and buildSite hook for seeding
    return Promise.all(
      data.map((form) =>
        this.payload.create({
          collection: 'site-forms' as CollectionSlug,
          data: form,
          overrideAccess: true,
        })
      )
    ) as Promise<SiteForm[]>
  }

  async loadFormSubmissions(formId: number, siteId: number, count: number = 10) {
    const data = formSubmissions(formId, siteId, count)
    const results: unknown[] = []
    for (let i = 0; i < data.length; i++) {
      const result = await this.payload.create({
        collection: 'site-form-submissions' as CollectionSlug,
        data: data[i],
        overrideAccess: true,
      })
      results.push(result)
    }
    return results
  }

  async runLoading(siteId: number) {
    try {
      const tags = await this.loadtags(siteId)
      const collectionTypes = await this.loadCollectionTypes(siteId)
      // @ts-ignore
      await this.loadCollectionEntries(siteId, collectionTypes, tags)
      await this.loadPages(siteId)
      await this.loadPublishedBuildStatus(siteId)

      // Load forms and submissions
      const createdForms = await this.loadForms(siteId)
      for (const form of createdForms) {
        const submissionCount = Math.floor(Math.random() * 6) + 10 // 10-15 submissions
        await this.loadFormSubmissions(form.id, siteId, submissionCount)
      }
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
