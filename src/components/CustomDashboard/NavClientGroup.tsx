'use client'

import React, { useId, useState } from 'react'
import { ChevronIcon } from '@payloadcms/ui'

type NavClientGroupProps = {
  children: React.ReactNode
  defaultOpen?: boolean
  label: string
  navOpen?: boolean
}

export function NavClientGroup({
  children,
  defaultOpen = true,
  label,
  navOpen = true,
}: NavClientGroupProps) {
  const [expanded, setExpanded] = useState(defaultOpen)

  const contentId = useId()

  return (
    <div
      className={[
        'nav-group',
        label,
        !expanded && 'nav-group--collapsed',
      ]
        .filter(Boolean)
        .join(' ')}
      id={`nav-group-${label}`}
    >
      <button
        aria-controls={contentId}
        aria-expanded={expanded}
        className={[
          'nav-group__toggle',
          `nav-group__toggle--${expanded ? 'open' : 'collapsed'}`,
        ].join(' ')}
        onClick={() => setExpanded((prev) => !prev)}
        tabIndex={!navOpen ? -1 : 0}
        type="button"
      >
        <div className="nav-group__label">
          {label}
        </div>
        <div className="nav-group__indicator">
          <ChevronIcon
            className={[
              'nav-group__indicator-icon',
              expanded
                ? 'nav-group__indicator-icon--open'
                : 'nav-group__indicator-icon--collapsed',
            ].join(' ')}
          />
        </div>
      </button>

      <div
        id={contentId}
        aria-hidden={!expanded}
        className={[
          'nav-group__content-wrapper',
          expanded && 'nav-group__content-wrapper--open',
          'transition-height',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="nav-group__content">
          {children}
        </div>
      </div>
    </div>
  )
}
