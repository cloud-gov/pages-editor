import type { Validate } from 'payload'

export const validatePage: Validate<any, any, any, any> = (value, options) => {
  const { req, required } = options
  const isDraft = req?.query?.draft === 'true' || req?.query?.autosave === 'true'

  if (isDraft) return true
  if (required && !value) return 'Page is required.'
  return true
}

type RelationshipSingleOptions = {
  relationTo?: string
  requirePublished?: boolean
  messages?: {
    required?: string
    notFound?: string
    notPublished?: string
  }
}

/**
 * Draft-aware validator for a single relationship (ID or {id}).
 * - Skips validation during autosave/draft.
 * - Enforces presence on publish when required.
 * - Optionally verifies existence & published status on publish.
 */
export const makeValidateRelationshipSingle = (
  opts?: RelationshipSingleOptions,
): Validate<unknown, any, any, any> => {
  const {
    relationTo,
    requirePublished = false,
    messages = {
      required: 'A selection is required.',
      notFound: 'Selected item could not be found.',
      notPublished: 'Selected item is not published.',
    },
  } = opts || {}

  // Note: return type is `true | string` (no `undefined`)
  return async (value, options): Promise<true | string> => {
    const { req, required, field } = options as any

    const isDraft =
      req?.query?.draft === 'true' || req?.query?.autosave === 'true'
    if (isDraft) return true

    // Normalize single relationship value to an ID (string/number)
    const id =
      value == null
        ? null
        : typeof value === 'object' && (value as any)?.id != null
        ? (value as any).id
        : value

    // Enforce "required" at publish
    if (required && (id == null || String(id).trim() === '')) {
      return messages.required ?? 'A selection is required.'
    }

    // Optional existence / publish-status check at publish
    if (id != null) {
      const targetCollection: string =
        relationTo ?? (field?.relationTo as string)

      try {
        const doc = await req.payload.findByID({
          collection: targetCollection,
          id,
        })

        if (!doc) {
          return messages.notFound ?? 'Selected item could not be found.'
        }

        if (requirePublished) {
          const status = (doc as any)?._status
          if (status !== 'published') {
            return (
              messages.notPublished ?? 'Selected item is not published.'
            )
          }
        }
      } catch {
        return messages.notFound ?? 'Selected item could not be found.'
      }
    }

    return true
  }
}
