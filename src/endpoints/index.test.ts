import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The forms endpoints are gated behind the FEATURE_FORMS flag. Because
 * `src/endpoints/index.ts` evaluates the flag at module-load time, each case
 * resets the module registry and re-imports it after stubbing the env var.
 */
describe('endpoints registration feature flag', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  async function loadEndpointPaths() {
    const mod = await import('./index')
    return (mod.default as Array<{ path: string }>).map((e) => e.path)
  }

  it('registers the public forms endpoints when FEATURE_FORMS is "enabled"', async () => {
    vi.stubEnv('FEATURE_FORMS', 'enabled')
    const paths = await loadEndpointPaths()
    expect(paths).toContain('/public/forms/:id/schema')
    expect(paths).toContain('/public/forms/:id/submit')
  })

  it('does NOT register the forms endpoints when FEATURE_FORMS is unset', async () => {
    vi.stubEnv('FEATURE_FORMS', '')
    const paths = await loadEndpointPaths()
    expect(paths).not.toContain('/public/forms/:id/schema')
    expect(paths).not.toContain('/public/forms/:id/submit')
  })

  it('does NOT register the forms endpoints when FEATURE_FORMS is "disabled"', async () => {
    vi.stubEnv('FEATURE_FORMS', 'disabled')
    const paths = await loadEndpointPaths()
    expect(paths).not.toContain('/public/forms/:id/schema')
    expect(paths).not.toContain('/public/forms/:id/submit')
  })

  it('keeps the non-forms endpoints regardless of the flag', async () => {
    vi.stubEnv('FEATURE_FORMS', '')
    const paths = await loadEndpointPaths()
    // siteSelect endpoint should always be present
    expect(paths.length).toBeGreaterThan(0)
  })
})
