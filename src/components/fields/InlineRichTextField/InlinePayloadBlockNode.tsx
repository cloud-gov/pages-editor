
import React from 'react'
import {
  $applyNodeReplacement,
  DecoratorNode,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical'

import { InlinePayloadBlockCard } from './InlinePayloadBlockCard'

export type PayloadBlockFields = {
  id: string
  blockName?: string
  blockType: string
  [key: string]: unknown
}

export type SerializedInlinePayloadBlockNode = Spread<
  {
    type: 'block'
    version: 2
    fields: PayloadBlockFields
    format?: string
  },
  SerializedLexicalNode
>

export class InlinePayloadBlockNode extends DecoratorNode<React.ReactElement> {
  __fields: PayloadBlockFields
  __format: string

  static getType(): string {
    return 'block'
  }

  static clone(node: InlinePayloadBlockNode): InlinePayloadBlockNode {
    return new InlinePayloadBlockNode(
      node.__fields,
      node.__format,
      node.__key,
    )
  }

  static importJSON(
    serializedNode: SerializedInlinePayloadBlockNode,
  ): InlinePayloadBlockNode {
    return $createInlinePayloadBlockNode({
      fields: serializedNode.fields,
      format: serializedNode.format ?? '',
    })
  }

  constructor(
    fields: PayloadBlockFields,
    format = '',
    key?: NodeKey,
  ) {
    super(key)
    this.__fields = fields
    this.__format = format
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement('div')
    element.className = 'custom-blocks-field__payload-block collapsible--style-default width-full'
    return element
  }

  updateDOM(): false {
    return false
  }

  decorate(): React.ReactElement {
    return (
      <InlinePayloadBlockCard
        fields={this.__fields}
        nodeKey={this.__key}
      />
    )
  }

  exportJSON(): SerializedInlinePayloadBlockNode {
    return {
      type: 'block',
      version: 2,
      fields: this.__fields,
      format: this.__format,
    }
  }

  getTextContent(): string {
    return ''
  }

  isInline(): false {
    return false
  }

  setFields(fields: PayloadBlockFields): void {
    const writable = this.getWritable()
    writable.__fields = fields
  }

  getFields(): PayloadBlockFields {
    return this.__fields
  }
}

export function $createInlinePayloadBlockNode(args: {
  fields: PayloadBlockFields
  format?: string
}): InlinePayloadBlockNode {
  return $applyNodeReplacement(
    new InlinePayloadBlockNode(
      args.fields,
      args.format ?? '',
    ),
  )
}

export function $isInlinePayloadBlockNode(
  node: LexicalNode | null | undefined,
): node is InlinePayloadBlockNode {
  return node instanceof InlinePayloadBlockNode
}
