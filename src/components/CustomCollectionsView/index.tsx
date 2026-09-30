'use client'
import React, { useEffect, useRef } from 'react'
import type { ListViewClientProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'

import './index.scss'

export default function CustomClientListView(props: ListViewClientProps) {

  // content collection filter and columns blocks
  const selectors = [
    '.rs__input',
    '.list-controls__columns',
    '.list-controls__columns > div',
    '.list-controls__columns div',
    '.list-controls__where',
    '.list-controls__where > div',
  ]

  const removeStyleIfMatched = (element: Element) => {
    if (selectors.some((s) => element.matches(s))) {
      element.removeAttribute('style')
    }
  }

  const removeInlineStyles = () => {
    document
      .querySelectorAll(selectors.join(', '))
      .forEach((el) => el.removeAttribute('style'))
  }

  useEffect(() => {
    removeInlineStyles()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof Element
        ) {
          removeStyleIfMatched(mutation.target)
        }

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return
          }

          removeStyleIfMatched(node)

          node
            .querySelectorAll(selectors.join(', '))
            .forEach((el) => el.removeAttribute('style'))
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    })

    return () => observer.disconnect()
  }, [])

  // fixes a11y issues for list checkboxes

  useEffect(() => {
    const rows = document.querySelectorAll(
      'tbody tr',
    )

    rows.forEach((row) => {
      const checkbox = row.querySelector(
        'input[type="checkbox"]',
      )
      const title = row.querySelector(
        '.cell-title a',
      )?.textContent

      if (
        checkbox instanceof HTMLInputElement && title
      ) {
          checkbox.setAttribute(
            'aria-label',
            `Select ${title}`
          )
      }
    })
  }, [])

  const lastInputWasKeyboard = useRef(false)
  const lastAnnouncement = useRef('')

  useEffect(() => {
    let toolbarFocused = false

    const handleKeyDown = () => {
      lastInputWasKeyboard.current = true
    }

    const handleMouseDown = () => {
      lastInputWasKeyboard.current = false
    }

    const observer = new MutationObserver(() => {
      const toolbar = document.querySelector('.list-selection')
      const liveRegion =
        document.getElementById('selection-status')

      if (toolbar instanceof HTMLElement) {
        toolbar.setAttribute('role', 'toolbar')
        toolbar.setAttribute('tabindex', '-1')

        const selectedText =
          toolbar.querySelector('span')?.textContent ?? ''

        const announcement =
          selectedText.length > 0
            ? `${selectedText}. Actions available.`
            : ''

        if (
          liveRegion &&
          announcement &&
          announcement !== lastAnnouncement.current
        ) {
          liveRegion.textContent = announcement
          lastAnnouncement.current = announcement
        }

        // Only move focus the first time the toolbar appears
        if (!toolbarFocused && lastInputWasKeyboard.current) {
          toolbar.focus()
          toolbarFocused = true
        }
        
      } else {
        // Toolbar disappeared, reset state
        toolbarFocused = false

        if(liveRegion) {
          liveRegion.textContent = ''
        }

        lastAnnouncement.current = ''
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      observer.disconnect()

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      window.removeEventListener(
        'mousedown',
        handleMouseDown,
      )
    }
  }, [])

  return (
    <div>
      <DefaultListView {...props} />
      <div
        id="selection-status"
        className="sr-only"
        aria-live="polite"
      ></div>
    </div>
  )
}
