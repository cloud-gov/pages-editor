import type { Validate } from 'payload'

/**
 * Draft-aware validator for single-select fields
 * - sips validation during autosave/draft
 * - enforce presence on publish when field is required
 */

export const validateSelectSingle: Validate<string, any, any, any> = (value, options) => {
  const { req, required } = options
  const isDraft = req?.query?.draft === 'true' || req?.query?.autosave === 'true'

  if (isDraft) return true

  // On publish: if required, ensure a non-empty string
  if (required && !String(value ?? '').trim()) {
    return 'A selection is required.'
  }

  return true
}
