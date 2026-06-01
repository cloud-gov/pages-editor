'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TextFieldClientProps } from 'payload'
import { FieldLabel, useField } from '@payloadcms/ui'

import { findTokenByHex, uswdsColorTokens } from './tokens'
import './index.scss'

export const UswdsColorSelect: React.FC<TextFieldClientProps> = ({
  field,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { value, setValue } = useField<string>({ path: path || field.name })
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selected = useMemo(() => findTokenByHex(value), [value])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return uswdsColorTokens
    return uswdsColorTokens.filter(
      (c) =>
        c.token.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q) ||
        c.family.toLowerCase().includes(q),
    )
  }, [search])

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus()
  }, [isOpen])

  const handleSelect = useCallback(
    (hex: string) => {
      setValue(hex)
      setIsOpen(false)
      setSearch('')
    },
    [setValue],
  )

  const handleClear = useCallback(() => {
    setValue(null)
    setIsOpen(false)
    setSearch('')
  }, [setValue])

  const readOnly = Boolean(readOnlyFromProps)

  return (
    <div className="field-type uswds-color-select" ref={wrapperRef}>
      <FieldLabel htmlFor={`field-${path}`} label={field.label || field.name} />
      <button
        id={`field-${path}`}
        type="button"
        className="uswds-color-select__trigger"
        onClick={() => !readOnly && setIsOpen((open) => !open)}
        disabled={readOnly}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className="uswds-color-select__swatch"
          style={{ backgroundColor: value || 'transparent' }}
          aria-hidden
        />
        <span className="uswds-color-select__trigger-text">
          <span className="uswds-color-select__token">
            {selected?.token ?? (value ? 'Custom' : 'Select a color')}
          </span>
          {value && <span className="uswds-color-select__hex">{value}</span>}
        </span>
        <span className="uswds-color-select__caret" aria-hidden>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="uswds-color-select__panel" role="dialog">
          <input
            ref={searchInputRef}
            type="text"
            className="uswds-color-select__search"
            placeholder="Search USWDS tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="uswds-color-select__list" role="listbox">
            {filtered.map((c) => {
              const isSelected = selected?.token === c.token
              return (
                <li key={c.token}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={
                      'uswds-color-select__option' +
                      (isSelected ? ' uswds-color-select__option--selected' : '')
                    }
                    onClick={() => handleSelect(c.hex)}
                  >
                    <span
                      className="uswds-color-select__swatch"
                      style={{ backgroundColor: c.hex }}
                      aria-hidden
                    />
                    <span className="uswds-color-select__token">{c.token}</span>
                    <span className="uswds-color-select__hex">{c.hex}</span>
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="uswds-color-select__empty">No matching tokens</li>
            )}
          </ul>
          <div className="uswds-color-select__footer">
            <button
              type="button"
              className="uswds-color-select__clear"
              onClick={handleClear}
              disabled={!value}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}