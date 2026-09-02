'use client'

import React, { useMemo, useState } from 'react'
import type { ClientBlock } from 'payload'
import { useTranslation } from '@payloadcms/ui'
import { getTranslation } from '@payloadcms/translations'

import { Modal, type ModalFieldConfig } from '@/components/Modal'

type Props = {
  blocks: ClientBlock[]
  isOpen: boolean
  path: string
  onClose: () => void
  onSelectBlock: (blockSlug: string) => void
  title: string
}

export const BlockPickerModal: React.FC<Props> = ({
  blocks,
  isOpen,
  path,
  onClose,
  onSelectBlock,
  title,
}) => {
  const { i18n } = useTranslation()

  const [values, setValues] = useState<Record<string, any>>({
    selectedBlockType: '',
  })

  const options = useMemo(
    () =>
      blocks.map((block) => ({
        label: getTranslation(block.labels?.singular ?? block.slug, i18n),
        value: block.slug,
      })),
    [blocks, i18n],
  )

  const fields: ModalFieldConfig[] = [
    {
      name: 'selectedBlockType',
      label: 'Block type',
      type: 'select',
      required: true,
      placeholder: 'Select a block type',
      options,
    },
  ]

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
    const createButton = document.getElementById('modalCreate');
    createButton?.focus();
  }

  const handleSubmit = () => {
    const selected = values.selectedBlockType

    if (!selected || typeof selected !== 'string') {
      return
    }

    onSelectBlock(selected)

    setValues({
      selectedBlockType: '',
    })
  }

  const handleClose = () => {
    setValues({
      selectedBlockType: '',
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      path={path}
      mode="create"
      title={title}
      description="Choose which block to add to Page Content."
      metaText="Select a block type to append to the current Page Content field."
      fields={fields}
      values={values}
      error={null}
      saving={false}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  )
}
