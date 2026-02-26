import type { CollectionType } from '@/payload-types'
import { formatSlug } from '@/fields/slug/formatSlug'

const collectionTypes = (siteId: number): CollectionType[] => {
  const collectionType = (title: string, id: number, description?: string): CollectionType => {
    return {
      id,
      site: siteId,
      title,
      slug: formatSlug(title),
      description,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
  }

  return [
    collectionType('Articles', 1, 'A collection of articles on various topics.'),
    collectionType('Resources', 2, 'A collection of resources and guides.'),
    collectionType('Blog Posts', 3, 'A collection of blog posts and updates.'),
    collectionType('Events', 4, 'A collection of upcoming and past events.'),
    collectionType('Projects', 5, 'A collection of projects and case studies.'),
  ]
}

export default collectionTypes
