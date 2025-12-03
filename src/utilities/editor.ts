// standardize our editor features
import { lexicalEditor, FixedToolbarFeature, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'

export const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature(), EXPERIMENTAL_TableFeature()],
})
