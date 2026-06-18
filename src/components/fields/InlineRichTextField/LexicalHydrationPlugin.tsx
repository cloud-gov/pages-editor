'use client'

import { useEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type Props = {
  value: any
  onHydrated?: () => void
}

function transformPayloadLinksToNativeLinks(node: any): any {
  if (node == null || typeof node !== 'object') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(transformPayloadLinksToNativeLinks)
  }

  if (
    node.type === 'link' &&
    node.fields &&
    typeof node.fields.url === 'string'
  ) {
    const { fields, id, ...rest } = node

    const newTab = Boolean(fields.target)

    return {
      ...rest,
      type: 'link',
      version: node.version ?? 1,
      url: fields.url,
      target: newTab ? fields.target : null,
      rel: newTab ? 'noopener noreferrer' : null,
      title:
        typeof fields.title === 'string'
          ? fields.title
          : null,
      children: Array.isArray(node.children)
        ? node.children.map(transformPayloadLinksToNativeLinks)
        : [],
    }
  }

  const transformed: Record<string, any> = {}

  for (const [key, value] of Object.entries(node)) {
    transformed[key] = transformPayloadLinksToNativeLinks(value)
  }

  return transformed
}

export function LexicalHydrationPlugin({
  value,
  onHydrated,
}: Props) {
  const [editor] = useLexicalComposerContext()
  const initializedRef = useRef(false)
  useEffect(() => {
    if (initializedRef.current) {
      return
    }

    const hasValidRoot =
      value?.root &&
      Array.isArray(value.root.children)

    if (!hasValidRoot) {
      queueMicrotask(() => {
        initializedRef.current = true
        onHydrated?.()
      })
      return
    }

    try {
      const transformedValue =
        transformPayloadLinksToNativeLinks(value)

      const editorState =
        editor.parseEditorState(transformedValue)

      queueMicrotask(() => {

        editor.setEditorState(editorState)

        initializedRef.current = true
        onHydrated?.()
      })

      
    } catch (error) {
      console.error(
        'Failed to hydrate inline rich text editor state',
        error,
      )

      initializedRef.current = true
      onHydrated?.()
    }
  }, [editor, value, onHydrated])

  return null
}
