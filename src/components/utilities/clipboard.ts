/**
 * Local port of Payload's clipboard utilities for array rows.
 *
 * These helpers live in `@payloadcms/ui` but are not part of the package's
 * public `exports` map (only deep, non-exported `dist/...` paths), so they
 * cannot be imported directly. The logic is copied verbatim from
 * `@payloadcms/ui/dist/elements/ClipboardAction/*` to keep behaviour identical
 * to the stock array field's Copy Row / Paste Row actions.
 */
import type { TFunction } from '@payloadcms/translations'
import type { ClientBlock, ClientField } from 'payload'
import { fieldAffectsData, fieldHasSubFields } from 'payload/shared'
import ObjectIdImport from 'bson-objectid'

const ObjectId = (
  'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport
) as typeof ObjectIdImport

const localStorageClipboardKey = '_payloadClipboard'

type FormState = Record<string, any>

type ClipboardCopyData = {
  path: string
  rowIndex?: number
} & ({ blocks: ClientBlock[]; type: 'blocks' } | { fields: ClientField[]; type: 'array' })

type ClipboardCopyActionArgs = {
  getDataToCopy: () => FormState
  t: TFunction
} & ClipboardCopyData

type ClipboardPasteData = {
  data: FormState
  path: string
  rowIndex?: number
} & ({ blocks: ClientBlock[]; type: 'blocks' } | { fields: ClientField[]; type: 'array' })

type ClipboardPasteActionArgs = {
  onPaste: (data: ClipboardPasteData) => void
  path: string
  t: TFunction
} & ({ schemaBlocks: ClientBlock[] } | { schemaFields: ClientField[] })


export function clipboardCopy(args: ClipboardCopyActionArgs): string | true {
  const { getDataToCopy, t, ...rest } = args
  const dataToWrite = { data: getDataToCopy(), ...rest }
  try {
    localStorage.setItem(localStorageClipboardKey, JSON.stringify(dataToWrite))
    return true
  } catch (_err) {
    return t('error:unableToCopy')
  }
}

export function clipboardPaste({
  onPaste,
  path: fieldPath,
  t,
  ...args
}: ClipboardPasteActionArgs): string | true {
  let dataToPaste: any
  try {
    const jsonFromClipboard = localStorage.getItem(localStorageClipboardKey)
    if (!jsonFromClipboard) {
      return t('error:invalidClipboardData')
    }
    dataToPaste = JSON.parse(jsonFromClipboard)
  } catch (_err) {
    return t('error:invalidClipboardData')
  }

  const dataToValidate = { ...dataToPaste, ...args, fieldPath }

  if (!isClipboardDataValid(dataToValidate)) {
    return t('error:invalidClipboardData')
  }

  onPaste(dataToPaste)
  return true
}

function isClipboardDataValid({ data, path, ...args }: any): boolean {
  if (typeof data === 'undefined' || !path || !args.type) {
    return false
  }
  if (args.type === 'blocks') {
    return isClipboardBlocksValid({
      blocksFromClipboard: args.blocks,
      blocksFromConfig: args.schemaBlocks,
    })
  }
  return isClipboardFieldsValid({
    fieldsFromClipboard: args.fields,
    fieldsFromConfig: args.schemaFields,
  })
}

function isClipboardFieldsValid({ fieldsFromClipboard, fieldsFromConfig }: any): boolean {
  if (!fieldsFromConfig || fieldsFromClipboard.length !== fieldsFromConfig?.length) {
    return false
  }
  return fieldsFromClipboard.every((clipboardField: any, i: number) => {
    const configField = fieldsFromConfig[i]
    if (clipboardField.type !== configField.type) {
      return false
    }
    const affectsData = fieldAffectsData(clipboardField) && fieldAffectsData(configField)
    if (affectsData && clipboardField.name !== configField.name) {
      return false
    }
    const hasNestedFieldsConfig = fieldHasSubFields(configField)
    const hasNestedFieldsClipboard = fieldHasSubFields(clipboardField)
    if (hasNestedFieldsClipboard !== hasNestedFieldsConfig) {
      return false
    }
    if (hasNestedFieldsClipboard && hasNestedFieldsConfig) {
      return isClipboardFieldsValid({
        fieldsFromClipboard: clipboardField.fields,
        fieldsFromConfig: configField.fields,
      })
    }
    return true
  })
}

function isClipboardBlocksValid({ blocksFromClipboard, blocksFromConfig }: any): boolean {
  const configBlockMap = new Map(blocksFromConfig?.map((block: any) => [block.slug, block]))
  if (!configBlockMap.size) {
    return false
  }
  const checkedSlugs = new Set<string>()
  for (const currBlock of blocksFromClipboard) {
    const currSlug = currBlock.slug
    if (!checkedSlugs.has(currSlug)) {
      const configBlock = configBlockMap.get(currSlug) as any
      if (!configBlock) {
        return false
      }
      if (
        !isClipboardFieldsValid({
          fieldsFromClipboard: currBlock.fields,
          fieldsFromConfig: configBlock.fields,
        })
      ) {
        return false
      }
      checkedSlugs.add(currSlug)
    }
  }
  return true
}

export function reduceFormStateByPath({
  formState,
  path,
  rowIndex,
}: {
  formState: FormState
  path: string
  rowIndex?: number
}): FormState {
  const filteredState: FormState = {}
  const prefix = typeof rowIndex !== 'number' ? path : `${path}.${rowIndex}`
  for (const key in formState) {
    if (!key.startsWith(prefix)) {
      continue
    }
    const { customComponents: _, validate: __, ...field } = formState[key]
    if (Array.isArray(field.rows)) {
      field.rows = field.rows.map((row: any) => {
        if (!row || typeof row !== 'object') {
          return row
        }
        const { customComponents: _c, ...serializableRow } = row
        return serializableRow
      })
    }
    filteredState[key] = field
  }
  return filteredState
}

export function mergeFormStateFromClipboard({
  dataFromClipboard: clipboardData,
  formState,
  path,
  rowIndex,
}: {
  dataFromClipboard: ClipboardPasteData
  formState: FormState
  path: string
  rowIndex?: number
}): FormState {
  const {
    type: typeFromClipboard,
    data: dataFromClipboard,
    path: pathFromClipboard,
    rowIndex: rowIndexFromClipboard,
  } = clipboardData

  const copyFromField = typeof rowIndexFromClipboard !== 'number'
  const pasteIntoField = typeof rowIndex !== 'number'
  const fromRowToField = !copyFromField && pasteIntoField
  const isArray = typeFromClipboard === 'array'

  let pathToReplace: string
  if (copyFromField && pasteIntoField) {
    pathToReplace = pathFromClipboard
  } else if (copyFromField) {
    pathToReplace = `${pathFromClipboard}.${rowIndex}`
  } else {
    pathToReplace = `${pathFromClipboard}.${rowIndexFromClipboard}`
  }

  let targetSegment: string
  if (!pasteIntoField) {
    targetSegment = `${path}.${rowIndex}`
  } else if (fromRowToField) {
    targetSegment = `${path}.0`
  } else {
    targetSegment = path
  }

  if (fromRowToField) {
    const lastRenderedPath = `${path}.0`
    const rowIDFromClipboard = dataFromClipboard[`${pathToReplace}.id`]?.value
    const hasRows = formState[path].rows?.length
    formState[path].rows = [
      {
        ...(hasRows && isArray ? formState[path].rows[0] : {}),
        id: rowIDFromClipboard,
        isLoading: false,
        lastRenderedPath,
      },
    ]
    formState[path].value = 1
    formState[path].initialValue = 1
    formState[path].disableFormData = true
    for (const fieldPath in formState) {
      if (
        fieldPath !== path &&
        !fieldPath.startsWith(lastRenderedPath) &&
        fieldPath.startsWith(path)
      ) {
        delete formState[fieldPath]
      }
    }
  }

  const idReplacements = new Map<string, string>()
  for (const clipboardPath in dataFromClipboard) {
    if (
      (!pasteIntoField && clipboardPath === `${pathToReplace}.id`) ||
      !clipboardPath.startsWith(pathToReplace)
    ) {
      continue
    }
    const newPath = clipboardPath.replace(pathToReplace, targetSegment)
    const customComponents = isArray ? formState[newPath]?.customComponents : undefined
    const validate = isArray ? formState[newPath]?.validate : undefined
    if (clipboardPath.endsWith('.id') && dataFromClipboard[clipboardPath]?.value) {
      const oldID = dataFromClipboard[clipboardPath].value
      if (typeof oldID === 'string' && ObjectId.isValid(oldID)) {
        const newID = new ObjectId().toHexString()
        idReplacements.set(clipboardPath, newID)
        formState[newPath] = {
          customComponents,
          validate,
          ...dataFromClipboard[clipboardPath],
          initialValue: newID,
          value: newID,
        }
        continue
      }
    }
    formState[newPath] = {
      customComponents,
      validate,
      ...dataFromClipboard[clipboardPath],
    }
  }

  for (const [clipboardPath, newID] of idReplacements) {
    const relativePath = clipboardPath.replace(`${pathToReplace}.`, '')
    const segments = relativePath.split('.')
    if (segments.length >= 2) {
      const segmentRowIndex = parseInt(segments[segments.length - 2], 10)
      const parentFieldPath = segments.slice(0, segments.length - 2).join('.')
      const fullParentPath = parentFieldPath ? `${targetSegment}.${parentFieldPath}` : targetSegment
      if (formState[fullParentPath] && Array.isArray(formState[fullParentPath].rows)) {
        const parentRows = formState[fullParentPath].rows
        if (!isNaN(segmentRowIndex) && parentRows[segmentRowIndex]) {
          parentRows[segmentRowIndex].id = newID
        }
      }
    } else if (segments.length === 1 && segments[0] === 'id') {
      const targetParts = targetSegment.split('.')
      const lastPart = targetParts[targetParts.length - 1]
      const rowIndexFromTarget = !isNaN(parseInt(lastPart, 10)) ? parseInt(lastPart, 10) : 0
      const fieldPath = !isNaN(parseInt(lastPart, 10))
        ? targetParts.slice(0, -1).join('.')
        : targetSegment
      if (formState[fieldPath] && Array.isArray(formState[fieldPath].rows)) {
        const rows = formState[fieldPath].rows
        if (rows[rowIndexFromTarget]) {
          rows[rowIndexFromTarget].id = newID
        }
      }
    }
  }

  return formState
}
