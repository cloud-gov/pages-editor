// standardize our editor features
import { AccordionBlock } from '@/blocks/Accordion'
import { CardGridBlock } from '@/blocks/CardGrid'
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
      blocks: [ProcessListBlock, AccordionBlock, CardGridBlock],
    }),
  ],
})
