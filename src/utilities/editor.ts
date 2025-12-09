// standardize our editor features
import { ProcessListBlock } from '@/blocks/ProcessList'
import { 
  lexicalEditor,
  FixedToolbarFeature,
  EXPERIMENTAL_TableFeature,
  BlocksFeature
} from '@payloadcms/richtext-lexical'

export const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    EXPERIMENTAL_TableFeature(),
    BlocksFeature({
      blocks: [ProcessListBlock],
    }),
  ],
})
