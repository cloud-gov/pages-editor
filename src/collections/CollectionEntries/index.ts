import type { CollectionConfig } from 'payload'
import { tagsField, siteField, collectionTypeField, updatedByField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { editor } from '@/utilities/editor'
import { completeReview } from '@/hooks/completeReview'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'
import { relatedItems } from '@/fields/relatedItems'
import { getCustomCollectionLivePreview, getCustomCollectionPreview } from '@/utilities/previews'
import { validateTextRequired } from '@/utilities/validators/text'

export const CollectionEntries: CollectionConfig = {
  slug: 'collection-entries',
  labels: {
    singular: 'Collection Type Entry',
    plural: 'Collection Type Entries',
  },
  admin: {
    description:
      'Add content page entries to your collections types. All fields are available for maximum flexibility.',
    defaultColumns: ['title', 'collectionConfig', 'slug', 'updatedAt', 'updatedBy', '_status'],
    useAsTitle: 'title',
    hideAPIURL: true,
    livePreview: {
      url: getCustomCollectionLivePreview,
    },
    preview: getCustomCollectionPreview,
  },
  access: {
    create: getAdminOrSiteUser('collection-entries'),
    delete: getAdminOrSiteUser('collection-entries'),
    read: getAdminOrSiteUser('collection-entries', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('collection-entries'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    collectionConfig: true,
  },
  fields: [
    collectionTypeField,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      editor,
      admin: {
        description: "Content entry's description or summary",
      },
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'This image will be used as the thumbnail',
      },
    },
    {
      name: 'files',
      label: 'Files',
      type: 'array',
      admin: {
        description: 'Add downloadable files or attachments',
      },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional label for the file (e.g., "Download PDF")',
          },
        },
      ],
    },
    ...slugField(),
    {
      name: 'contentDate',
      label: 'Content Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Optional date associated with this content',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    tagsField,
    siteField,
    {
      name: 'content',
      type: 'blocks',
      label: 'Page Content',
      blocks: [
        {
          slug: 'richText',
          labels: {
            singular: 'Rich Text Section',
            plural: 'Rich Text Sections',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor,
              admin: {
                description: 'Main content body',
              },
            },
          ],
        },
        {
          slug: 'cardGrid',
          labels: {
            singular: 'Card Grid',
            plural: 'Card Grids',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              defaultValue: 'Featured Content',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Section Description',
              defaultValue: 'Discover our latest updates and important information.',
            },
            {
              name: 'cards',
              type: 'array',
              label: 'Content Cards',
              minRows: 1,
              maxRows: 24,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Card Title',
                  required: true,
                  validate: validateTextRequired,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Card Description',
                },
                {
                  name: 'image',
                  type: 'upload',
                  label: 'Card Image',
                  relationTo: 'media',
                },
                {
                  name: 'link',
                  type: 'group',
                  label: 'Card Link',
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Link URL',
                    },
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Link Text',
                      defaultValue: 'Learn More',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          slug: 'textBlock',
          labels: {
            singular: 'Text Block',
            plural: 'Text Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Block Title',
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Content',
              editor,
            },
            {
              name: 'bgImage',
              type: 'upload',
              label: 'Background Image',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    updatedByField,
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
        description: 'Display the in-page navigation sidebar on this content',
      },
    },
    relatedItems('collection-entries'),
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [publish],
    beforeChange: [addSite, completeReview, populateUpdatedBy],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
