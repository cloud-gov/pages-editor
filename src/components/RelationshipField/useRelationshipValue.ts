import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ID,
  Option,
  mergeSelectedWithDocs,
  resolveOptionForAdd,
} from './relationshipUtils'

type FetchDocsFn = (
  collectionSlug: string,
  queryBody: any,
  signal: AbortSignal,
) => Promise<any[]>

type AddIDArgs = {
  labelOverride?: string
  optionPool?: Option[]
}

export function useRelationshipValue(args: {
  primaryCollectionSlug?: string
  selectedIDs: ID[]
  hasMany: boolean
  writeValue: (ids: ID[]) => void
  locale: string
  labelField: string
  fetchDocs: FetchDocsFn
}) {
  const {
    primaryCollectionSlug,
    selectedIDs,
    hasMany,
    writeValue,
    locale,
    labelField,
    fetchDocs,
  } = args

  const [selected, setSelected] = useState<Option[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const addID = useCallback(
    (id: ID, options?: AddIDArgs) => {
      if (id === null || id === undefined || id === 'undefined') return

      const strId = String(id)
      const optionPool = options?.optionPool ?? []
      const labelOverride = options?.labelOverride

      setSelected((prev) => {
        if (prev.some((p) => String(p.id) === strId)) {
          return prev
        }

        const next = resolveOptionForAdd({
          id,
          optionPool,
          labelOverride,
        })

        return [...prev, next]
      })

      writeValue(hasMany ? [...selectedIDs, id] : [id])
    },
    [hasMany, selectedIDs, writeValue],
  )

  const removeID = useCallback(
    (id: ID) => {
      writeValue(selectedIDs.filter((x) => String(x) !== String(id)))
      setSelected((prev) => prev.filter((p) => String(p.id) !== String(id)))
    },
    [selectedIDs, writeValue],
  )

  const clearAll = useCallback(() => {
    writeValue([])
    setSelected([])
  }, [writeValue])

  const updateSelectedLabel = useCallback((id: ID, nextLabel: string) => {
    setSelected((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? { ...item, label: nextLabel }
          : item,
      ),
    )
  }, [])

  const selectedIDsKey = useMemo(() => selectedIDs.join('|'), [selectedIDs])
  useEffect(() => {
    if (!primaryCollectionSlug || selectedIDs.length === 0) {
      setSelected([])
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    ;(async () => {
      try {
        const queryBody = {
          depth: 0,
          draft: true,
          limit: selectedIDs.length,
          locale,
          select: { id: true, [labelField]: true },
          where: { id: { in: selectedIDs } },
        }

        const docs = await fetchDocs(
          primaryCollectionSlug,
          queryBody,
          controller.signal,
        )

        setSelected((prev) =>
          mergeSelectedWithDocs(prev, selectedIDs, docs, labelField),
        )
      } catch (e: any) {
        if (e?.name === 'AbortError') return

        setSelected((prev) =>
          mergeSelectedWithDocs(prev, selectedIDs, [], labelField),
        )
      }
    })()

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryCollectionSlug, selectedIDsKey, labelField, locale, fetchDocs])

  return {
    selected,
    setSelected,
    addID,
    removeID,
    clearAll,
    updateSelectedLabel,
  }
}
