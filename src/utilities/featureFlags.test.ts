import { afterEach, describe, expect, it, vi } from 'vitest'
import { isCustomContentInputEnabled, isFormsEnabled } from './featureFlags'

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

describe('isCustomContentInputEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns true when CUSTOM_CONTENT_INPUT is exactly "enabled"', () => {
    vi.stubEnv('CUSTOM_CONTENT_INPUT', 'enabled')
    expect(isCustomContentInputEnabled()).toBe(true)
  })

  it('returns false when CUSTOM_CONTENT_INPUT is unset', () => {
    vi.stubEnv('CUSTOM_CONTENT_INPUT', '')
    expect(isCustomContentInputEnabled()).toBe(false)
  })

  it('returns false when CUSTOM_CONTENT_INPUT is "disabled"', () => {
    vi.stubEnv('CUSTOM_CONTENT_INPUT', 'disabled')
    expect(isCustomContentInputEnabled()).toBe(false)
  })

  it('returns false for other truthy-looking values', () => {
    for (const value of ['true', '1', 'Enabled', 'ENABLED', 'yes', ' enabled ']) {
      vi.stubEnv('CUSTOM_CONTENT_INPUT', value)
      expect(isCustomContentInputEnabled()).toBe(false)
    }
  })
})
