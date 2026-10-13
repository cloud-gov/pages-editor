import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InlineRichTextField } from './index'

const mockOnChangePlugin = vi.fn()

vi.mock('@lexical/react/LexicalComposer', () => ({
  LexicalComposer: ({ children }: any) => children,
}))

vi.mock('@lexical/react/LexicalRichTextPlugin', () => ({
  RichTextPlugin: () => null,
}))

vi.mock('@lexical/react/LexicalHistoryPlugin', () => ({
  HistoryPlugin: () => null,
}))

vi.mock('@lexical/react/LexicalListPlugin', () => ({
  ListPlugin: () => null,
}))

vi.mock('@lexical/react/LexicalTablePlugin', () => ({
  TablePlugin: () => null,
}))

vi.mock('./InlineRichTextToolbar', () => ({
  InlineRichTextToolbar: () => null,
}))

vi.mock('./LexicalHydrationPlugin', () => ({
  LexicalHydrationPlugin: ({
    onHydrated,
  }: {
    onHydrated: () => void
  }) => {
    onHydrated()
    return null
  },
}))

vi.mock('@lexical/react/LexicalOnChangePlugin', () => ({
  OnChangePlugin: ({
    onChange,
  }: {
    onChange: (
      editorState: any,
      editor: any,
      tags: Set<string>,
    ) => void
  }) => {
    mockOnChangePlugin(onChange)
    return null
  },
}))

describe('InlineRichTextField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not call field onChange for hydration updates', async () => {
    const fieldOnChange = vi.fn()

    const value = {
      root: {
        children: [],
      },
    }

    render(
      <InlineRichTextField
        value={value}
        path="content.0.content"
        onChange={fieldOnChange}
      />,
    )

    await waitFor(() =>
      expect(mockOnChangePlugin).toHaveBeenCalled(),
    )

    const callback =
      mockOnChangePlugin.mock.calls[0][0]

    callback(
      {
        toJSON: () => ({
          root: {
            children: [],
          },
        }),
      },
      {},
      new Set(['inline-rich-text-hydration']),
    )

    expect(fieldOnChange).not.toHaveBeenCalled()
  })

  it('calls field onChange for user edits', async () => {
    const fieldOnChange = vi.fn()

    render(
      <InlineRichTextField
        value={{ root: { children: [] } }}
        path="content.0.content"
        onChange={fieldOnChange}
      />,
    )

    const callback =
      mockOnChangePlugin.mock.calls[0][0]

    callback(
      {
        toJSON: () => ({
          root: {
            children: [],
          },
        }),
      },
      {},
      new Set(),
    )

    expect(fieldOnChange).toHaveBeenCalledTimes(1)
  })
})
