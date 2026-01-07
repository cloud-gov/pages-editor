
import type { Validate } from 'payload'

/**
 * Extracts plain text from a Lexical JSON richText value.
 * Handles arrays or single root objects; safeguards against unexpected shapes.
 */
function lexicalToPlainText(value: unknown): string {
  if (!value) return ''

  // Value can be an array of nodes or a single root node { root: { children: [...] } }
  const roots: any[] = Array.isArray(value)
    ? value
    : typeof value === 'object' && (value as any).root
    ? [(value as any).root]
    : []

  const parts: string[] = []

  const walk = (node: any) => {
    if (!node || typeof node !== 'object') return

    // Text node
    if (node.type === 'text' && typeof node.text === 'string') {
      parts.push(node.text)
    }

    // Children
    const children = Array.isArray(node.children) ? node.children : []
    for (const child of children) walk(child)
  }

  for (const root of roots) walk(root)

  return parts.join(' ')
}

/**
 * Draft-aware "required" validator for richText.
 * - Skips validation during autosave/draft.
 * - Enforces non-empty content (at least one non-whitespace character) on publish.
 */
export const validateRichTextRequired: Validate<unknown, any, any, any> = (value, options) => {
  const { req, required } = options
  const isDraft = req?.query?.draft === 'true' || req?.query?.autosave === 'true'
  if (isDraft) return true

  if (!required) return true

  const text = lexicalToPlainText(value)
  if (text.trim().length === 0) {
    return 'This field is required.'
  }

  return true
}
