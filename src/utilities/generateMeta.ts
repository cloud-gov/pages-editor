import type { Metadata } from 'next'

import type { Post } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Partial<Post> }): Promise<Metadata> => {
  const { doc } = args || {}

  const title = 'Payload Website Template'

  return {
    description: 'description',
    openGraph: mergeOpenGraph({
      description: '',
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
