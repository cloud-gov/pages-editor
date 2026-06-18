export const resolveBlockSummary = ({
  rowPath,
  row,
  getFieldValue,
}: {
  rowPath: string
  row: { blockType?: string }
  getFieldValue: (path: string) => unknown
}): string => {

  if (!row.blockType) {
    return ''
  }

  const type = row.blockType

  // Block-specific mappings (expand over time)
  switch (type) {
    case 'hero': {
      const title = getFieldValue(`${rowPath}.title`)
      const subtitle = getFieldValue(`${rowPath}.subtitle`)

      return (
        (typeof title === 'string' && title) ||
        (typeof subtitle === 'string' && subtitle) ||
        'Hero section'
      )
    }

    case 'textBlock': {
      const title = getFieldValue(`${rowPath}.title`)
      return (typeof title === 'string' && title) || 'Text block'
    }

    case 'cardGrid': {
      const title = getFieldValue(`${rowPath}.title`)
      return (typeof title === 'string' && title) || 'Card grid'
    }

    case 'richText': {
      return 'Rich text content'
    }

    case 'formBlock': {
      const title = getFieldValue(`${rowPath}.title`)
      return (typeof title === 'string' && title) || 'Form'
    }

    default: {
      const blockName = getFieldValue(`${rowPath}.blockName`)
      return (typeof blockName === 'string' && blockName) || type
    }
  }
}
