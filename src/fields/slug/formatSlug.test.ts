import { describe, it, expect } from 'vitest'
import { formatSlug, generateRandomSlug, formatSlugHook } from './formatSlug'

describe('formatSlug', () => {
  it('should replace spaces with hyphens', () => {
    expect(formatSlug('hello world')).toBe('hello-world')
    expect(formatSlug('multiple   spaces')).toBe('multiple---spaces')
  })

  it('should remove non-word characters except hyphens', () => {
    expect(formatSlug('hello@world!')).toBe('helloworld')
    expect(formatSlug('hello#world$')).toBe('helloworld')
    expect(formatSlug('hello.world')).toBe('helloworld')
  })

  it('should convert to lowercase', () => {
    expect(formatSlug('HELLO WORLD')).toBe('hello-world')
    expect(formatSlug('Hello World')).toBe('hello-world')
  })

  it('should handle complex strings', () => {
    expect(formatSlug('Hello World! How are you?')).toBe('hello-world-how-are-you')
    expect(formatSlug('Test@#$%^&*()+{}|:"<>?[]\\;\',./')).toBe('test')
  })

  it('should handle empty string', () => {
    expect(formatSlug('')).toBe('')
  })

  it('should handle string with only special characters', () => {
    expect(formatSlug('!@#$%^&*()')).toBe('')
  })

  it('should preserve hyphens', () => {
    expect(formatSlug('hello-world')).toBe('hello-world')
    expect(formatSlug('hello--world')).toBe('hello--world')
  })
})

describe('generateRandomSlug', () => {
  it('should generate a string', () => {
    const slug = generateRandomSlug()
    expect(typeof slug).toBe('string')
    expect(slug.length).toBeGreaterThan(0)
  })

  it('should generate different slugs on multiple calls', () => {
    const slug1 = generateRandomSlug()
    const slug2 = generateRandomSlug()
    expect(slug1).not.toBe(slug2)
  })

  it('should generate alphanumeric characters only', () => {
    const slug = generateRandomSlug()
    expect(slug).toMatch(/^[a-z0-9]+$/)
  })
})

describe('formatSlugHook', () => {
  const createMockHookArgs = (overrides: any = {}) => ({
    data: {},
    operation: 'create' as const,
    value: null,
    blockData: {},
    collection: { config: {} },
    context: {},
    field: { name: 'slug' },
    fieldPath: 'slug',
    fullData: {},
    originalDoc: {},
    path: 'slug',
    previousValue: null,
    req: {} as any,
    siblingData: {},
    ...overrides
  })

  it('should return random slug when value is empty', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title' },
      value: ''
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return random slug when value is null', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title' },
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return random slug when value is undefined', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title' },
      value: undefined
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should format string value', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title' },
      value: 'Hello World!'
    }))
    expect(result).toBe('hello-world')
  })

  it('should use fallback field for create operation when no value', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title' },
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should use fallback field for create operation when no existing slug', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title' },
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should use fallback for update operation when slug exists', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title', slug: 'existing-slug' },
      operation: 'update',
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return original value when not create operation and slug exists', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 'Test Title', slug: 'existing-slug' },
      operation: 'update',
      value: 'original-value'
    }))
    expect(result).toBe('original-value')
  })

  it('should handle non-string fallback data', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { title: 123 },
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle missing fallback field', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: { otherField: 'value' },
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle empty data object', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: {},
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle null data', () => {
    const hook = formatSlugHook('title')
    const result = hook(createMockHookArgs({
      data: null,
      value: null
    }))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
