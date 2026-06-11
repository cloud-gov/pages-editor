import { afterEach, describe, expect, it, vi } from 'vitest'
import { isFormsEnabled } from './featureFlags'

describe('isFormsEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns true when FEATURE_FORMS is exactly "enabled"', () => {
    vi.stubEnv('FEATURE_FORMS', 'enabled')
    expect(isFormsEnabled()).toBe(true)
  })

  it('returns false when FEATURE_FORMS is unset', () => {
    vi.stubEnv('FEATURE_FORMS', '')
    expect(isFormsEnabled()).toBe(false)
  })

  it('returns false when FEATURE_FORMS is "disabled"', () => {
    vi.stubEnv('FEATURE_FORMS', 'disabled')
    expect(isFormsEnabled()).toBe(false)
  })

  it('returns false for other truthy-looking values', () => {
    for (const value of ['true', '1', 'Enabled', 'ENABLED', 'yes', ' enabled ']) {
      vi.stubEnv('FEATURE_FORMS', value)
      expect(isFormsEnabled()).toBe(false)
    }
  })
})
