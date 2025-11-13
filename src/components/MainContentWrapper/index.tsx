'use client'

import { useEffect } from 'react'

export const MainContentWrapper: React.FC = () => {
  useEffect(() => {
    // Find the template wrapper and add id="main-content" to it
    const mainContent = document.querySelector('.template-default__wrap')
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content'
    }
  }, [])

  return null
}
