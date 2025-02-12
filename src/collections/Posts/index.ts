import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import type { Post } from '../../payload-types'

import { authenticated } from '../../access/authenticated'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import { lexicalEditor, HTMLConverterFeature, lexicalHTML } from '@payloadcms/richtext-lexical';
import { slugField } from '@/fields/slug'

import { customFields } from './custom'
import pDebounce from 'p-debounce';

const DEBOUNCE_TIME = 1000
const debouncedFetch = pDebounce(fetch, DEBOUNCE_TIME, { before: true });

// webhook to update preview
export const previewWebhook: CollectionAfterChangeHook<Post> = async ({
  doc,
}) => {
  await debouncedFetch(process.env.PROMPT_URL || '')
  return doc
}

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        return `${process.env.PREVIEW_URL}/posts/${data.slug}`
      },
    },
    preview: (data) => {
      return `${process.env.PREVIEW_URL}/posts/${data.slug}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // The HTMLConverter Feature is the feature which manages the HTML serializers. If you do not pass any arguments to it, it will use the default serializers.
          HTMLConverterFeature({}),
        ],
      })
    },
    lexicalHTML('content', { name: 'content_html' }),
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        // position: 'sidebar',
        hidden: true,
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField(),
    ...customFields,
  ],
  hooks: {
    afterChange: [revalidatePost, previewWebhook],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  }
}
