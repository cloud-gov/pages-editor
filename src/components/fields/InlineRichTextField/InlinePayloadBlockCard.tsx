// InlinePayloadBlockCard.tsx
'use client'

import React from 'react'
import { $getNodeByKey, type NodeKey } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import {
  $isInlinePayloadBlockNode,
  type PayloadBlockFields,
} from './InlinePayloadBlockNode'

import {
  AccordionBlockCard,
} from './blocks/Accordion/AccordionBlockCard'
import { ProcessListBlockCard } from './blocks/ProcessList/ProcessListBlockCard'

type AccordionItem = {
  id?: string
  heading?: string
  content?: unknown
}

type Props = {
  fields: PayloadBlockFields
  nodeKey: NodeKey
}

export function InlinePayloadBlockCard({
  fields,
  nodeKey,
}: Props) {
  const [editor] = useLexicalComposerContext()

  const removeBlock = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)

      if ($isInlinePayloadBlockNode(node)) {
        node.remove()
      }
    })
  }

  switch (fields.blockType) {
  case 'accordion':
    return (
      <AccordionBlockCard
        nodeKey={nodeKey}
        fields={fields as any}
      />
    )
  case 'processList':
    return (
      <ProcessListBlockCard
        nodeKey={nodeKey}
        fields={fields as any}
      />
    )

  default:
    return (
      <>unsupported block card</>
    )
}

  return (
    <section className="custom-blocks-field__payload-block-card">
      <strong>Unsupported block:</strong> {fields.blockType}
      <div className="custom-blocks-field__payload-block-actions">
        <button type="button" onClick={removeBlock}>
          Remove
        </button>
      </div>
    </section>
  )
}
