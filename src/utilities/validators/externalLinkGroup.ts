import type { Validate } from 'payload'

const isEmptyString = (str): boolean => {
  return !(!str || str === null || (typeof str === 'string' && str === ''))
}

export const validateExternalLinkGroup = (
  siblingField: string,
): Validate<any[] | null | undefined, any, any, any> => {
  return (value, { siblingData }) => {
    const sibling = siblingData[siblingField]
    const isSiblingEmpty = isEmptyString(sibling)

    if (!isEmptyString(value) && isSiblingEmpty) {
      return `This field must have text if "${siblingField}" field has text.`
    }

    return true
  }
}
