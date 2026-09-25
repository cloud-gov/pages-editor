import type { BlocksField } from 'payload'
import { collectionEntryBlock, externalLinkBlock, pageLinkBlock } from './hyperlinks'

export const relatedItems: BlocksField = {
  name: 'relatedItems',
  label: 'Related Item Links',
  type: 'blocks',
  admin: {
    components: {
      Field: '@/components/fields/CustomBlocksField#CustomBlocksField'
    },
    description:
      'Add related items to display at the bottom of this page. Can include internal items or external links.',
  },
  blocks: [pageLinkBlock, collectionEntryBlock, externalLinkBlock],
}
