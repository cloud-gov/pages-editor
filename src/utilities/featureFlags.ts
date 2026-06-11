/**
 * Feature flags for the Pages Editor.
 *
 * Flags are gated on exact string matches of environment variables so that a
 * feature is only ever enabled when explicitly turned on. Anything other than
 * the expected value (including an unset variable) keeps the feature disabled.
 */

/**
 * Whether the site Forms / Form Submissions feature is enabled.
 *
 * Enabled only when the `FEATURE_FORMS` environment variable is exactly the
 * string `"enabled"`. This gates:
 *  - registration of the `site-forms` and `site-form-submissions` collections
 *  - registration of the public form schema/submit endpoints
 *  - the admin UI nav groups and dashboard sections for Forms
 */
export function isFormsEnabled(): boolean {
  return process.env.FEATURE_FORMS === 'enabled'
}
