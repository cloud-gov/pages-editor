import type { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { colorOptions, readyForReviewField } from '@/fields'
import { uswdsColorField } from '@/fields/styles/uswdsColors'
import { getGlobalPreviewUrl } from '@/utilities/previews'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Identity',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Site Configuration',
    description: 'Set global branding details like site name, logo, and typography.',
    livePreview: {
      url: getGlobalPreviewUrl,
    },
    components: {
      // Replace the default PublishButton with custom user-aware publish button
      elements: {
        PublishButton: '@/components/CustomPublishButton',
      },
    },
  },
  fields: [
    {
      name: 'agencyName',
      type: 'text',
      required: true,
      defaultValue: 'Agency Name',
    },
    {
      name: 'tagline',
      type: 'text',
    },
    colorOptions({
      name: 'primaryColor',
      label: 'The primary color family for the site',
      defaultValue: 'blue-warm-vivid',
    }),
    colorOptions({
      name: 'secondaryColor',
      label: 'The secondary color family for the site',
      defaultValue: 'red-vivid',
    }),
    {
      name: 'primaryFont',
      label: 'The primary font family used for the site',
      type: 'select',
      options: [
        {
          label: 'Georgia (serif)',
          value: 'georgia',
        },
        {
          label: 'Helvetica (sans-serif)',
          value: 'helvetica',
        },
        {
          label: 'Merriweather (serif)',
          value: 'merriweather',
        },
        {
          label: 'Open Sans (sans-serif)',
          value: 'open-sans',
        },
        {
          label: 'Public Sans (sans-serif)',
          value: 'public-sans',
        },
        {
          label: 'Roboto Mono (monospace)',
          value: 'roboto-mono',
        },
        {
          label: 'Source Sans Pro (sans-serif)',
          value: 'source-sans-pro',
        },
        {
          label: 'System (sans-serif)',
          value: 'system',
        },
        {
          label: 'Tahoma (sans-serif)',
          value: 'tahoma',
        },
        {
          label: 'Verdana (sans-serif)',
          value: 'verdana',
        },
      ],
      defaultValue: 'open-sans',
    },
    {
      name: 'favicon',
      label: "This image will be used as the site's favicon",
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logo',
      label: "This image will be used as the site's logo",
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'theme',
      type: 'group',
      fields: [
        uswdsColorField({ name: 'colorPrimary', defaultValue: '#112f4e' }),
        uswdsColorField({ name: 'colorPrimaryOn', defaultValue: '#ffffff' }),
        uswdsColorField({ name: 'colorSecondary', defaultValue: '#005ea2' }),
        uswdsColorField({ name: 'colorSecondaryOn', defaultValue: '#ffffff' }),
        uswdsColorField({ name: 'colorAccent', defaultValue: '#8b0a03' }),
        uswdsColorField({ name: 'colorText', defaultValue: '#1b1b1b' }),
        uswdsColorField({ name: 'colorBg', defaultValue: '#ffffff' }),
        uswdsColorField({ name: 'colorSurface', defaultValue: '#fcfcfc' }),
        uswdsColorField({ name: 'colorBorder', defaultValue: '#e6e6e6' }),
        uswdsColorField({ name: 'colorLink', defaultValue: '#112f4e' }),
        {
          name: 'fontBody',
          type: 'text',
          defaultValue:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        {
          name: 'fontHeading',
          type: 'text',
          defaultValue: '"Playfair Display", Georgia, "Times New Roman", Times, serif',
        },
        { name: 'layoutMaxWidth', type: 'text', defaultValue: '75rem' },
        { name: 'spaceSectionY', type: 'text', defaultValue: '2rem' },
        { name: 'radiusMd', type: 'text', defaultValue: '0.25rem' },
        { name: 'customCss', type: 'textarea', defaultValue: '' },
      ],
    },
    readyForReviewField,
  ],
}