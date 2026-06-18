// standardize our editor features
import { AccordionBlock } from '@/blocks/Accordion'
import { ProcessListBlock } from '@/blocks/ProcessList'
import { ImageBlock } from '@/blocks/Image'
import { 
  lexicalEditor,
  FixedToolbarFeature,
  EXPERIMENTAL_TableFeature,
  BlocksFeature
} from '@payloadcms/richtext-lexical'

export const editorFeatures = ({ defaultFeatures }: any) => [
  ...defaultFeatures,
  FixedToolbarFeature(),
  EXPERIMENTAL_TableFeature(),
  BlocksFeature({
    blocks: [
      ProcessListBlock,
      AccordionBlock,
      ImageBlock,
    ]
  })
]

export const editor = lexicalEditor({
  features: editorFeatures,
})
