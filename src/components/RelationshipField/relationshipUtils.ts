export type ID = string | number
export type RelationTo = string | string[]
export type ValueWithRelation = { relationTo: string; value: ID }
export type Option = { id: ID; label: string }

export const uniq = <T,>(arr: T[]) => Array.from(new Set(arr))

export function sanitizeIDs(ids: ID[]): ID[] {
  return uniq(
    ids.filter((id) => id !== null && id !== undefined && id !== 'undefined'),
  )
}

export function normalizeToIDs(
  value: unknown,
  hasMany: boolean,
): Array<string | number> {
  if (value == null) return []

  if (hasMany) {
    if (!Array.isArray(value)) return []

    return sanitizeIDs(
      value
        .map((v: any) => {
          if (typeof v === 'string' || typeof v === 'number') return v
          if (v && typeof v === 'object' && 'value' in v) return v.value
          return null
        })
        .filter((v: any) => v !== null && v !== undefined && v !== 'undefined'),
    )
  }

  if (typeof value === 'string' || typeof value === 'number') return [value]

  if (typeof value === 'object' && value && 'value' in (value as any)) {
    const v = (value as any).value
    if (v === null || v === undefined || v === 'undefined') return []
    return [v]
  }

  return []
}

export function buildRelationshipValue(args: {
  ids: ID[]
  hasMany: boolean
  isPolymorphic: boolean
  relationTo: RelationTo
}): ID[] | ID | ValueWithRelation[] | ValueWithRelation | null {
  const { ids, hasMany, isPolymorphic, relationTo } = args
  const cleaned = sanitizeIDs(ids)

  if (!isPolymorphic) {
    if (hasMany) return cleaned
    return cleaned[0] ?? null
  }

  const targetSlug = Array.isArray(relationTo) ? relationTo[0] : relationTo

  if (hasMany) {
    return cleaned.map((id) => ({
      relationTo: targetSlug,
      value: id,
    }))
  }

  return cleaned[0]
    ? {
        relationTo: targetSlug,
        value: cleaned[0],
      }
    : null
}

export function mapDocsToOptions(docs: any[], labelField: string): Option[] {
  return docs
    .map((doc) => {
      const id = doc?.id
      if (id === null || id === undefined) return null

      return {
        id,
        label: String(doc?.[labelField] ?? id),
      } as Option
    })
    .filter(Boolean) as Option[]
}

export function mergeSelectedWithDocs(
  prev: Option[],
  selectedIDs: ID[],
  docs: any[],
  labelField: string,
): Option[] {
  const prevById = new Map<string, string>(
    prev.map((item) => [String(item.id), item.label]),
  )

  return selectedIDs.map((id) => {
    const strId = String(id)
    const doc = docs.find((d) => String(d?.id) === strId)

    const fetchedLabel = doc?.[labelField]
    const existingLabel = prevById.get(strId)

    return {
      id,
      label: String(fetchedLabel ?? existingLabel ?? strId),
    }
  })
}

export function resolveOptionForAdd(args: {
  id: ID
  optionPool?: Option[]
  labelOverride?: string
}): Option {
  const { id, optionPool = [], labelOverride } = args
  const strId = String(id)

  const fromPool = optionPool.find((o) => String(o.id) === strId)
  if (fromPool) return fromPool

  if (labelOverride != null) {
    return { id, label: labelOverride }
  }

  return { id, label: strId }
}
