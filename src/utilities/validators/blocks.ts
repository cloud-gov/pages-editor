import type { Validate } from 'payload'

/**
 * Draft-aware validator ensuring at least `min` blocks are present.
 * - Skips validation during autosave/draft.
 * - Enforces min count on publish.
 */
export const makeValidateBlocksMin = (
  min = 1,
  message = `Add at least ${min} block${min === 1 ? '' : 's'}.`,
): Validate<any[] | null | undefined, any, any, any> => {
  return (value, options) => {
    const { req, required } = options
    const isDraft = req?.query?.draft === 'true' || req?.query?.autosave === 'true'
    if (isDraft) return true

    const rows = Array.isArray(value) ? value : []
    // If field is required, min defaults to >= 1 even if the caller didn't pass min.
    const effectiveMin = required ? Math.max(1, min) : min

    if (rows.length < effectiveMin) return message
    return true
  }
}
