'use client'

import React, { useEffect } from 'react'

import type { EditMenuItemsClientProps } from 'payload'

const CustomEditMenuItems = (props: EditMenuItemsClientProps) => {
  useEffect(() => { 
    const docButton = document.querySelector(
      '.popup__trigger-wrap .popup-button'
    )

    if (
      docButton instanceof HTMLButtonElement
    ) {
      docButton.setAttribute('aria-label', 'Document Menu')
    }
  }, [])

  return (
    <></>
  )
}
export default CustomEditMenuItems
