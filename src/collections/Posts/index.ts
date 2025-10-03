import type { CollectionConfig } from 'payload'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
import { previewWebhook } from '@/utilities/previews'
import { categoriesField, siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { descriptionField, imageField } from '@/fields'
import { customFields } from './custom'
import { adminField } from '@/access/admin'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  admin: {
    group: 'Content Collection',
    description: 'Articles, updates, or blog content used to share ideas, news, or stories.',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, req }) => {
        // site isn't fetched at the necessary depth in `data`
        const site = await req.payload.findByID({
          collection: 'sites',
          id: data.site,
        })
        if(!process.env.PREVIEW_ROOT) {
          return `${process.env.PREVIEW_URL}/posts/preview/${data.slug}`
        } else {
          return `${process.env.PREVIEW_ROOT}-${site.name}.app.cloud.gov/${data.slug}`
        }
        
      },
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/posts/${data.slug}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('posts'),
    delete: getAdminOrSiteUser('posts'),
    read: getAdminOrSiteUser('posts', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('posts'),
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    descriptionField,
    imageField,
    categoriesField,
    siteField,
    {
      name: 'content',
      type: 'richText',
      editor,
    },
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
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
    afterChange: [revalidatePost, previewWebhook, publish],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
    beforeChange: [addSite],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
