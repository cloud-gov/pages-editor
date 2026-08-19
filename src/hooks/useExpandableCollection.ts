'use client'

import { useCallback, useMemo, useState } from 'react'

type UseExpandableCollectionOptions = {
  ids?: string[]
  initialExpandedIds?: string[]
}

export function useExpandableCollection({
  ids = [],
  initialExpandedIds = [],
}: UseExpandableCollectionOptions = {}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initialExpandedIds),
  )

  const isExpanded = useCallback(
    (id: string) => expandedIds.has(id),
    [expandedIds],
  )

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }, [])

  const expand = useCallback((id: string) => {
    setExpandedIds((current) => {
      if (current.has(id)) {
        return current
      }

      const next = new Set(current)
      next.add(id)

      return next
    })
  }, [])

  const collapse = useCallback((id: string) => {
    setExpandedIds((current) => {
      if (!current.has(id)) {
        return current
      }

      const next = new Set(current)
      next.delete(id)

      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(ids))
  }, [ids])

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set())
  }, [])

  const removeExpandedId = useCallback((id: string) => {
    setExpandedIds((current) => {
      if (!current.has(id)) {
        return current
      }

      const next = new Set(current)
      next.delete(id)

      return next
    })
  }, [])

  const expandedIdsList = useMemo(
    () => Array.from(expandedIds),
    [expandedIds],
  )

  return {
    expandedIds,
    expandedIdsList,
    isExpanded,
    toggleExpanded,
    expand,
    collapse,
    expandAll,
    collapseAll,
    removeExpandedId,
  }
}
