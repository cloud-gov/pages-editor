import type { CollectionConfig } from 'payload'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
import { tagsField, siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { descriptionField, imageField } from '@/fields'
import { customFields } from './custom'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'
import { getAdminCollectionPreview, getCollectionPreviewUrl } from '@/utilities/previews'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'
import { relatedItems } from '@/fields/relatedItems'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  admin: {
    // group: 'Content Collection',
    description: 'Articles, updates, or blog content used to share ideas, news, or stories.',
    defaultColumns: ['title', 'slug', 'updatedAt', 'updatedBy', '_status'],
    livePreview: {
      url: getCollectionPreviewUrl('posts'),
    },
    preview: getAdminCollectionPreview('posts'),
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
    tagsField,
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
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        components: {
          Cell: 'src/components/UpdatedByCellData/',
        },
      }
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
    {
      name: 'showInPageNav',
      label: 'Show In-Page Navigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Display the in-page navigation sidebar on this post',
      },
    },
    relatedItems('posts'),
    ...slugField(),
    ...customFields,
  ],
  hooks: {
    afterChange: [revalidatePost, publish],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
    beforeChange: [addSite, populateUpdatedBy],
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
