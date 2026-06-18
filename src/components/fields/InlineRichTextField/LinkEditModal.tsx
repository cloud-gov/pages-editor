'use client'

import React from 'react'

import {
  Modal,
  type ModalFieldConfig,
} from '@/components/Modal'

export type LinkType = 'custom' | 'internal'

export type LinkValues = {
  text: string
  linkType: LinkType
  url: string
  target?: string
  newTab: boolean
}

type Props = {
  isOpen: boolean
  values: LinkValues
  saving?: boolean
  error?: string | null
  onChange: (name: keyof LinkValues, value: any) => void
  onSave: () => void
  onClose: () => void
}

const LINK_FIELDS: ModalFieldConfig[] = [
  {
    name: 'text',
    label: 'Text',
    type: 'text',
    required: true,
    description:
      'The visible text that will be displayed for this link.',
  },
  {
    name: 'linkType',
    label: 'Link Type',
    type: 'radio',
    options: [
      {
        label: 'Custom URL',
        value: 'custom',
      },
      {
        label: 'Internal Link',
        value: 'internal',
      },
    ],
  },
  {
    name: 'url',
    label: 'URL',
    type: 'text',
    placeholder: 'https://www.example.gov',
    description:
      'Enter the destination URL.',
  },
  {
    name: 'newTab',
    label: 'Open in new tab',
    type: 'checkbox',
  },
]

export const LinkEditModal: React.FC<Props> = ({
  isOpen,
  values,
  saving = false,
  error = null,
  onChange,
  onSave,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      path="inline-rich-text-link"
      mode="edit"
      title="Edit Link"
      description="Configure the link settings."
      metaText="Editing link"
      fields={LINK_FIELDS}
      values={values}
      error={error}
      saving={saving}
      onChange={(name, value) => {
        onChange(name as keyof LinkValues, value)
      }}
      onSubmit={onSave}
      onClose={onClose}
    />
  )
}
