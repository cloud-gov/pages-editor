'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SelectFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'
import { FieldWrapper } from '../FieldWrapper'
import { resolveStaticText } from '@/components/utilities'
import './index.scss'

type NormalizedOption = {
  label: string
  value: string
}

export const CustomSelectField: SelectFieldClientComponent = ({ field, path }) => {
  const {
    value,
    setValue,
    showError,
    errorMessage,
  } = useField<string | null>({ path })

  const id = `field-${path}`

  const label = resolveStaticText(field.label, field.name)
  const description = resolveStaticText(field.admin?.description)
  const placeholder = resolveStaticText(field.admin?.placeholder) ?? 'Select a value'

  const options: NormalizedOption[] = useMemo(
    () =>
      (field.options ?? []).map((option) =>
        typeof option === 'string'
          ? { label: option, value: option }
          : {
              label: resolveStaticText(option.label, String(option.value)) ?? '',
              value: String(option.value),
            },
      ),
    [field.options],
  )

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  )

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [query, setQuery] = useState('')

  const rootRef = useRef<HTMLDivElement | null>(null)
  const controlRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const listboxId = `${id}-listbox`

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return options
    return options.filter((option) => option.label.toLowerCase().includes(term))
  }, [options, query])

  const closeMenu = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
    setQuery('')
  }, [])

  const openMenu = useCallback(() => {
    setOpen(true)
    setQuery('')
    setActiveIndex(() => {
      const selectedIndex = options.findIndex((o) => o.value === value)
      return selectedIndex >= 0 ? selectedIndex : 0
    })
    inputRef.current?.focus()
  }, [options, value])

  const selectOption = useCallback(
    (option: NormalizedOption) => {
      setValue(option.value)
      closeMenu()
      inputRef.current?.blur()
    },
    [closeMenu, setValue],
  )

  const clearValue = useCallback(() => {
    setValue(null)
    closeMenu()
    inputRef.current?.blur()
  }, [closeMenu, setValue])

  useEffect(() => {
    if (!open) return
    setActiveIndex(filteredOptions.length > 0 ? 0 : -1)
  }, [query])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open, closeMenu])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) {
        if (
          event.key === 'ArrowDown' ||
          event.key === 'ArrowUp' ||
          event.key === 'Enter'
        ) {
          openMenu()
          event.preventDefault()
        }
        return
      }

      switch (event.key) {
        case 'ArrowDown':
          setActiveIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
          event.preventDefault()
          break
        case 'ArrowUp':
          setActiveIndex((prev) => Math.max(prev - 1, 0))
          event.preventDefault()
          break
        case 'Home':
          setActiveIndex(0)
          event.preventDefault()
          break
        case 'End':
          setActiveIndex(filteredOptions.length - 1)
          event.preventDefault()
          break
        case 'Enter':
          if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
            selectOption(filteredOptions[activeIndex])
          }
          event.preventDefault()
          break
        case 'Escape':
          closeMenu()
          event.preventDefault()
          break
        case 'Tab':
          closeMenu()
          break
        default:
          break
      }
    },
    [activeIndex, closeMenu, filteredOptions, open, openMenu, selectOption],
  )

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={field.required}
      description={description}
      error={showError ? errorMessage : undefined}
      type="select"
    >
      <div
        ref={rootRef}
        className={['react-select-container', 'custom-select'].join(' ')}
      >
        <div
          className={['react-select', showError && 'react-select--error']
            .filter(Boolean)
            .join(' ')}
        >
          <div
            ref={controlRef}
            className={[
              'rs__control',
              open ? 'rs__control--is-focused' : null,
              !selectedOption ? 'rs__control--is-empty' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              if (!open) openMenu()
            }}
          >
            <span
              className={[
                'rs__value-container',
                selectedOption ? 'rs__value-container--has-value' : null,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* When not searching, show the selected label or placeholder. */}
              {!open && selectedOption ? (
                <span className="rs__single-value">{selectedOption.label}</span>
              ) : null}
              {!open && !selectedOption ? (
                <span className="rs__placeholder">{placeholder}</span>
              ) : null}

              <input
                ref={inputRef}
                id={id}
                type="text"
                className="rs__input"
                value={open ? query : ''}
                onChange={(event) => {
                  if (!open) setOpen(true)
                  setQuery(event.target.value)
                }}
                onKeyDown={onKeyDown}
                onFocus={() => {
                  if (!open) openMenu()
                }}
                placeholder={open && !selectedOption ? placeholder : ''}
                autoComplete="off"
                role="combobox"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={open ? listboxId : undefined}
                aria-activedescendant={
                  open && activeIndex >= 0
                    ? `${listboxId}-opt-${activeIndex}`
                    : undefined
                }
                aria-invalid={showError && Boolean(errorMessage) ? true : undefined}
              />
            </span>

            <span className="rs__indicators">
              {selectedOption ? (
                <span
                  className="rs__indicator rs__clear-indicator"
                  role="button"
                  tabIndex={-1}
                  aria-label="Clear value"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.stopPropagation()
                    clearValue()
                  }}
                >
                  <svg
                    className="icon icon--x"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="stroke"
                      d="M14 6L6 14M6 6L14 14"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              ) : null}

              <span className="rs__indicator-separator" />

              <span
                className="rs__indicator rs__dropdown-indicator"
                role="button"
                tabIndex={-1}
                aria-label="Toggle options"
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation()
                  if (open) {
                    closeMenu()
                  } else {
                    openMenu()
                  }
                }}
              >
                <svg
                  className="icon icon--chevron"
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="stroke"
                    d="M14 8L10 12L6 8"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </span>
          </div>

          {open ? (
            <div
              className="rs__menu"
              role="listbox"
              id={listboxId}
              aria-label={label}
            >
              {filteredOptions.length === 0 ? (
                <div className="rs__menu-notice">No options</div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    id={`${listboxId}-opt-${index}`}
                    role="option"
                    aria-selected={option.value === value}
                    className={[
                      'rs__option',
                      index === activeIndex ? 'rs__option--is-focused' : null,
                      option.value === value ? 'rs__option--is-selected' : null,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>
    </FieldWrapper>
  )
}
