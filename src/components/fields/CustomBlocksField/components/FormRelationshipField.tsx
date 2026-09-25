'use client'

import { useEffect, useState } from "react"

type FormOption = {
  value: string
  label: string
}

type SiteForm = {
  id: number
  title: string
}

export function FormRelationshipField({
  relationTo,
  value,
  disabled,
  onChange,
}: {
  relationTo?: string
  value?: string | number
  disabled?: boolean
  onChange: (value: string | number) => void
}) {
  const [forms, setForms] = useState<FormOption[]>([])

  useEffect(() => {
    // fetch forms
    async function loadForms() {
      const response = await fetch(`/api/${relationTo}`)

      const data = await response.json()

      const mappedForms = data.docs
        .sort((a: SiteForm, b: SiteForm) => a.title.localeCompare(b.title))
        .map((form: any) => ({
          value: String(form.id),
          label: form.title,
        }))

      setForms(mappedForms)
    }
    loadForms()
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

      {forms.map((form) => (
        <option key={form.value} value={form.value}>
          {form.label}
        </option>
      ))}
    </select>
  )
}
