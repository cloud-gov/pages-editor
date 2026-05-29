// test/mocks/payloadUI.ts
import { vi } from 'vitest'

export const mockSetValue = vi.fn()

export const mockUseField = vi.fn()
export const mockUseConfig = vi.fn()
export const mockUseLocale = vi.fn()
export const mockUseAuth = vi.fn()

export function resetPayloadMocks(overrides?: {
  value?: unknown
  readOnly?: boolean
  showError?: boolean
  errorMessage?: string
  formProcessing?: boolean
  selectedSiteId?: string | number | null
}) {
  mockSetValue.mockReset()

  mockUseField.mockReturnValue({
    value: overrides?.value ?? [],
    setValue: mockSetValue,
    readOnly: overrides?.readOnly ?? false,
    showError: overrides?.showError ?? false,
    errorMessage: overrides?.errorMessage ?? '',
    formProcessing: overrides?.formProcessing ?? false,
  })

  mockUseConfig.mockReturnValue({
    config: {
      routes: { api: '/api' },
    },
    getEntityConfig: vi.fn().mockReturnValue({
      admin: { useAsTitle: 'title' },
    }),
  })

  mockUseLocale.mockReturnValue({ code: 'en' })

  mockUseAuth.mockReturnValue({
    user: {
      selectedSiteId: overrides?.selectedSiteId ?? 123,
    },
  })
}
