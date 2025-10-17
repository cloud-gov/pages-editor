// payload/globals/PreFooter.ts
import { CollectionConfig, Field, GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'

function bigFooterCondition(data, siblingData, { blockData, path, user }): true | false {
  if (data?.preFooterType === 'big') {
    return true
  } else {
    return false
  }
}

function slimFooterCondition(data, siblingData, { blockData, path, user }): true | false {
  if (data?.preFooterType === 'slim') {
    return true
  } else {
    return false
  }
}

function preFooterTypeSelectedCondition(
  data,
  siblingData,
  { blockData, path, user },
): true | false {
  return (
    bigFooterCondition(data, siblingData, { blockData, path, user }) ||
    slimFooterCondition(data, siblingData, { blockData, path, user })
  )
}

function preFooterTypeNotSelectedCondition(
  data,
  siblingData,
  { blockData, path, user },
): true | false {
  return !preFooterTypeSelectedCondition(data, siblingData, { blockData, path, user })
}

export const PreFooter: GlobalConfig | CollectionConfig = {
  slug: 'pre-footer',
  label: 'Pre-footer',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Site Configuration',
    defaultColumns: ['id', 'site', '_status', 'updatedAt'],
  },
  fields: [
    {
      name: 'preFooterType',
      type: 'radio',
      label: 'Pre-footer type',
      options: [
        { label: 'Big', value: 'big' },
        { label: 'Slim', value: 'slim' },
      ],
      required: true,
      admin: {
        // condition: preFooterTypeNotSelectedCondition
      },
    },
    {
      type: 'collapsible',
      label: 'Connect Section',
      admin: {
        initCollapsed: false,
        condition: preFooterTypeSelectedCondition,
      },
      fields: [
        {
          name: 'connectSectionLocation',
          dbName: 'connect-section-location',
          type: 'radio',
          label: 'Location',
          options: [
            { label: 'Pre-footer bottom', value: 'bottom' },
            { label: 'Pre-footer right', value: 'right' },
          ],
          defaultValue: 'right',
          required: true,
          admin: {
            condition: bigFooterCondition,
          },
        },
        {
          name: 'contactCenter',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'Contact Center',
            singular: 'Contact Center',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/ContactCenterRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            // condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              admin: {
                condition: bigFooterCondition,
              },
            },
            {
              name: 'phone',
              label: 'Phone',
              type: 'text',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
            },
          ],
        },
        {
          name: 'facebook',
          type: 'array',
          maxRows: 1,
          label: ' ',
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/FacebookLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Url',
              required: true,
            },
          ],
        },
        {
          name: 'platform_x',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'X',
            singular: 'X',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/XLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'xUrl',
              type: 'text',
              label: 'Url',
              required: true,
            },
          ],
        },
        {
          name: 'youtube',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'YouTube',
            singular: 'YouTube',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/YoutubeLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'youtubeUrl',
              type: 'text',
              label: 'Url',
              required: true,
            },
          ],
        },
        {
          name: 'instagram',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'Instagram',
            singular: 'Instagram',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/InstagramLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'instagramUrl',
              type: 'text',
              label: 'Url',
              required: true,
            },
          ],
        },
        {
          name: 'rssfeed',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'RSS Feed',
            singular: 'RSS Feed',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/RssFeedLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'rssfeedUrl',
              type: 'text',
              label: 'Url',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Links Groups',
      admin: {
        initCollapsed: false,
        condition: bigFooterCondition,
      },
      fields: [
        {
          name: 'groupCols',
          type: 'select',
          label: 'Number of columns in a group',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ],
          defaultValue: '1',
          required: true,
        },
        {
          name: 'linksGroups',
          type: 'array',
          maxRows: 4,
          label: '',
          labels: {
            plural: 'Links Groups',
            singular: 'Links Group',
          },
          required: false,
          admin: {
            isSortable: true,
            disableListFilter: true,
            initCollapsed: false,
          },
          fields: [
            {
              name: 'groupName',
              type: 'text',
              label: 'Group Name',
              required: true,
            },
            {
              name: 'groupLinks',
              type: 'blocks',
              label: 'Links',
              labels: {
                singular: 'Link',
                plural: 'Links',
              },
              required: true,
              blocks: [
                {
                  slug: 'pageLink',
                  labels: {
                    singular: 'Page Link',
                    plural: 'Page Links',
                  },
                  admin: {
                    disableBlockName: true,
                  },
                  fields: [
                    {
                      name: 'name',
                      label: 'Name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'page',
                      label: 'Page',
                      type: 'relationship',
                      relationTo: 'pages',
                      required: true,
                      admin: {
                        allowCreate: false,
                      },
                    },
                  ],
                },
                {
                  slug: 'collectionLink',
                  labels: {
                    singular: 'Collection Link',
                    plural: 'Collection Links',
                  },
                  admin: {
                    disableBlockName: true,
                  },
                  fields: [
                    {
                      name: 'name',
                      label: 'Name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'page',
                      label: 'Content collection',
                      type: 'select',
                      options: [
                        { label: 'Events', value: 'events' },
                        { label: 'Leadership', value: 'leadership' },
                        { label: 'News', value: 'news' },
                        { label: 'Blog Posts', value: 'posts' },
                        { label: 'Reports', value: 'reports' },
                        { label: 'Resources', value: 'resources' },
                      ],
                      hasMany: false,
                      required: true,
                    },
                  ],
                },
                {
                  slug: 'externalLink',
                  labels: {
                    singular: 'External Link',
                    plural: 'External Links',
                  },
                  admin: {
                    disableBlockName: true,
                  },
                  fields: [
                    {
                      name: 'name',
                      label: 'Name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'linkUrl',
                      label: 'Url',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Links',
      admin: {
        initCollapsed: false,
        condition: slimFooterCondition,
      },
      fields: [
        {
          name: 'slimLinks',
          type: 'blocks',
          maxRows: 4,
          label: ' ',
          labels: {
            singular: 'Link',
            plural: 'Links',
          },
          required: false,
          blocks: [
            {
              slug: 'slimPageLink',
              labels: {
                singular: 'Page Link',
                plural: 'Page Links',
              },
              admin: {
                disableBlockName: true,
              },
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'page',
                  label: 'Page',
                  type: 'relationship',
                  relationTo: 'pages',
                  required: true,
                  admin: {
                    allowCreate: false,
                  },
                },
              ],
            },
            {
              slug: 'slimPageCollectionLink',
              dbName: 'pre_footer_slim_collection_link',
              labels: {
                singular: 'Collection Link',
                plural: 'Collection Links',
              },
              admin: {
                disableBlockName: true,
              },
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'page',
                  label: 'Content collection',
                  type: 'select',
                  options: [
                    { label: 'Events', value: 'events' },
                    { label: 'Leadership', value: 'leadership' },
                    { label: 'News', value: 'news' },
                    { label: 'Blog Posts', value: 'posts' },
                    { label: 'Reports', value: 'reports' },
                    { label: 'Resources', value: 'resources' },
                  ],
                  hasMany: false,
                  required: true,
                },
              ],
            },
            {
              slug: 'slimExternalLink',
              labels: {
                singular: 'External Link',
                plural: 'External Links',
              },
              admin: {
                disableBlockName: true,
              },
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'linkUrl',
                  label: 'Url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
