'use client'

import React, { useMemo, useRef } from 'react'

import { HeadingNode } from '@lexical/rich-text'
import {
  LinkNode
} from '@lexical/link'

import {
  ListItemNode,
  ListNode,
} from '@lexical/list'
import {
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table'

import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { CustomContentEditable } from './CustomContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'

import type { EditorState } from 'lexical'

import { FieldWrapper } from '@/components/fields/FieldWrapper'
import { LexicalHydrationPlugin } from './LexicalHydrationPlugin'
import { InlineRichTextToolbar } from './InlineRichTextToolbar'
import { InlinePayloadBlockNode } from './InlinePayloadBlockNode'

type Props = {
  description?: string
  disabled?: boolean
  label?: string
  onChange: (value: unknown) => void
  path?: string
  required?: boolean
  value: any
  showBlocksMenu?: boolean
}

function transformNativeLinksToPayloadLinks(node: any): any {
  if (!node || typeof node !== 'object') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(transformNativeLinksToPayloadLinks)
  }

  if (node.type === 'link' && typeof node.url === 'string') {

    const {
      url,
      rel,
      target,
      title,
      ...rest
    } = node

    return {
      ...rest,
      fields: {
        url,
        linkType: 'custom',
        target
      },
    }
  }

  const transformed: Record<string, any> = {}

  for (const [key, value] of Object.entries(node)) {
    transformed[key] =
      transformNativeLinksToPayloadLinks(value)
  }

  return transformed
}

export function InlineRichTextField({
  description,
  disabled,
  label,
  onChange,
  path,
  required,
  value,
  showBlocksMenu,
}: Props) {
  /**
   * If there is no existing value, allow changes immediately.
   * If there is an existing value, wait until hydration completes
   * before allowing OnChangePlugin to write back to form state.
   */
  const hydratedRef = useRef(!value?.root)

  const initialConfig = useMemo(
    () => ({
      namespace: path ?? 'inline-rich-text',
      theme: {
        text: {
          underline: 'editor-textUnderline',
          strikethrough: 'editor-textStrikethrough',
          code: 'editor-inlineCode'
        }
      },
      editable: !disabled,
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        LinkNode,
        InlinePayloadBlockNode
      ],
      onError(error: Error) {
        throw error
      },
    }),
    [disabled, path],
  )

  return (
    <FieldWrapper
      id={path || ''}
      label={label}
      required={required}
      description={description}
      type="richText"
      variant="default"
    >
      
        <div className="custom-blocks-field__inline-rich-text-editor">
          <LexicalComposer initialConfig={initialConfig}>
            <InlineRichTextToolbar showBlocksMenu={showBlocksMenu} />

            <RichTextPlugin
              contentEditable={
                <CustomContentEditable className="custom-blocks-field__lexical-content" />
              }
              placeholder={
                <div className="custom-blocks-field__lexical-placeholder">
                  Enter content...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <ListPlugin />
            <TablePlugin />

            <LexicalHydrationPlugin
              value={value}
              onHydrated={() => {
                hydratedRef.current = true
              }}
            />

            <OnChangePlugin
              onChange={(editorState: EditorState) => {
                const json = editorState.toJSON()

                if (!hydratedRef.current) {
                  return
                }

                const payloadJson =
                  transformNativeLinksToPayloadLinks(json)

                onChange(payloadJson)
              }}
            />
          </LexicalComposer>
        </div>
    </FieldWrapper>
  )
}
