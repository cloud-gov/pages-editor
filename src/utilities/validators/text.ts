import type { Validate } from 'payload'

/**
 * Draft-aware validator for single text fields (string).
 * - Skips validation during autosave/draft.
 * - Enforces "required" on publish.
 */
export const validateTextRequired: Validate<string | null | undefined, any, any, any> = (
  value,
  options,
) => {
  const { req, required } = options
  const isDraft = req?.query?.draft === 'true' || req?.query?.autosave === 'true'

  if (isDraft) return true

  // On publish: if required, ensure a non-empty, trimmed string
  const trimmed = String(value ?? '').trim()
  if (required && trimmed.length === 0) {
    return 'This field is required.'
  }
  return true
}
