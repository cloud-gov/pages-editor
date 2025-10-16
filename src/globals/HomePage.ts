import type { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Single Pages',
    description: 'Configure the home page content using flexible content blocks.',
  },
  fields: [
    {
      name: 'content',
      type: 'blocks',
      label: 'Page Content',
      blocks: [
        {
          slug: 'hero',
          labels: {
            singular: 'Hero Section',
            plural: 'Hero Sections',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Hero Title',
              required: true,
              defaultValue: 'Welcome to Our Site',
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Hero Subtitle',
              defaultValue: 'A modern, accessible website built with the best tools',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Hero Description',
              defaultValue: 'This is a description of what your site offers and why visitors should care.',
            },
            {
              name: 'bgImage',
              type: 'upload',
              label: 'Hero Background Image',
              relationTo: 'media',
            },
            {
              name: 'ctaButton',
              type: 'group',
              label: 'Call to Action Button',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Button Text',
                  defaultValue: 'Get Started',
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Button URL',
                  defaultValue: '/about',
                },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Button Style',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Outline', value: 'outline' },
                  ],
                  defaultValue: 'primary',
                },
              ],
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
              maxRows: 6,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Card Title',
                  required: true,
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
                    {
                      name: 'external',
                      type: 'checkbox',
                      label: 'External Link',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  name: 'category',
                  type: 'text',
                  label: 'Category Tag',
                  admin: {
                    description: 'Optional category or tag to display on the card',
                  },
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
            },
            {
              name: 'bgColor',
              type: 'select',
              label: 'Background Color',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Light Gray', value: 'gray-50' },
                { label: 'Blue', value: 'blue-50' },
                { label: 'Green', value: 'green-50' },
              ],
              defaultValue: 'white',
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'The title that appears in search results and browser tabs',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'A brief description of the page for search engines',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: 'Social Media Image',
          relationTo: 'media',
          admin: {
            description: 'Image that appears when sharing on social media',
          },
        },
      ],
    },
  ],
}
