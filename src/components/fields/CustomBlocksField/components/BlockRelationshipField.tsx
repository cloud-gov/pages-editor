'use client'

import { useEffect, useState } from "react"

type RelatedOption = {
  value: string
  label: string
}

type RelatedItem = {
  id: number
  title: string
}

export function BlockRelationshipField({
  relationTo,
  value,
  onChange,
}: {
  relationTo?: string
  value?: string | number
  disabled?: boolean
  onChange: (value: string | number) => void
}) {
  const [items, setItems] = useState<RelatedOption[]>([])

  useEffect(() => {
    // fetch related items
    async function loadRelated() {
      const response = await fetch(`/api/${relationTo}`)

      const data = await response.json()

      const mappedItems = data.docs
        .sort((a: RelatedItem, b: RelatedItem) => a.title.localeCompare(b.title))
        .map((item: any) => ({
          value: String(item.id),
          label: item.title,
        }))

      setItems(mappedItems)
    }
    loadRelated()
  }, [relationTo])

  return (
    <select
      className="usa-select"
      value={value ?? ''}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    >
      <option value="">
        Select a value
      </option>

      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  )
}
