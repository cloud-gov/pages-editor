// standardize our editor features
import { lexicalEditor, FixedToolbarFeature } from '@payloadcms/richtext-lexical'

export const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
})
