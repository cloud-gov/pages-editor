'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useConfig, useField, useLocale, useAuth } from '@payloadcms/ui'
import * as qs from 'qs-esm'
import { formatAdminURL } from 'payload/shared'
import './index.scss'
import { Modal } from '../Modal'

type RelationTo = string | string[]
type ValueWithRelation = { relationTo: string; value: string | number }
type Option = { id: string | number; label: string }

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr))

function normalizeToIDs(value: unknown, hasMany: boolean): Array<string | number> {
  if (value == null) return []

  if (hasMany) {
    if (!Array.isArray(value)) return []
    return uniq(
      value
        .map((v: any) => {
          if (typeof v === 'string' || typeof v === 'number') return v
          if (v && typeof v === 'object' && 'value' in v) return v.value
          return null
        })
        .filter((v: any) => v !== null && v !== undefined && v !== 'undefined'),
    )
  }

  if (typeof value === 'string' || typeof value === 'number') return [value]

  if (typeof value === 'object' && value && 'value' in (value as any)) {
    const v = (value as any).value
    if (v === null || v === undefined || v === 'undefined') return []
    return [v]
  }

  return []
}

const safeJson = async (res: Response) => {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export const RelationshipField = (props: any) => {
  const { path, field, label: labelProp } = props

  const { user } = useAuth()
  const selectedSiteId = user?.selectedSiteId

  const relationTo: RelationTo = field?.relationTo
  const hasMany: boolean = Boolean(field?.hasMany)
  const readOnlyFromField: boolean = Boolean(field?.admin?.readOnly)
  const required: boolean = Boolean(field?.required)

  const {
    value,
    setValue,
    readOnly: readOnlyFromHook,
    showError,
    errorMessage,
    formProcessing,
  } = useField<any>({ path })

  const readOnly = readOnlyFromHook || readOnlyFromField

  const { config, getEntityConfig } = useConfig()
  const { code: locale } = useLocale()

  const {
    routes: { api: apiRoute },
  } = config

  const isPolymorphic = Array.isArray(relationTo)
  const primaryCollectionSlug = isPolymorphic ? relationTo[0] : relationTo

  const collectionConfig = useMemo(
    () => (primaryCollectionSlug ? getEntityConfig({ collectionSlug: primaryCollectionSlug }) : null),
    [getEntityConfig, primaryCollectionSlug],
  )

  const labelField: string =
    field?.admin?.custom?.labelField ??
    collectionConfig?.admin?.useAsTitle ??
    'id'

  const createTitleField: string = field?.admin?.custom?.createTitleField ?? 'title'
  const createLabel: string = field?.admin?.custom?.createLabel ?? 'Create new'
  const minChars: number = field?.admin?.custom?.minChars ?? 2
  const maxResults: number = field?.admin?.custom?.maxResults ?? 10

  const fieldLabel = labelProp ?? field?.label ?? 'Relationship'
  const description: string | undefined = field?.admin?.description

  const selectedIDs = useMemo(() => normalizeToIDs(value, hasMany), [value, hasMany])

  const [selected, setSelected] = useState<Option[]>([])
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<Option[]>([]) // filtered results
  const [defaultOptions, setDefaultOptions] = useState<Option[]>([]) // unselected tags when active + query empty

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isControlActive, setIsControlActive] = useState(false)

  // modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createTitle, setCreateTitle] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSaving, setCreateSaving] = useState(false)
  const [editingTag, setEditingTag] = useState<Option | null>(null)

  const controlRootRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const listboxId = useMemo(() => `rel-${path}-listbox`, [path])
  const errorId = useMemo(() => `rel-${path}-error`, [path])
  const hintId = useMemo(() => `rel-${path}-hint`, [path])
  const statusId = useMemo(() => `rel-${path}-status`, [path])

  const adminCollectionURL = useCallback(
    (collectionSlug: string) =>
      formatAdminURL({
        apiRoute,
        path: `/${collectionSlug}`,
      }),
    [apiRoute],
  )

  const writeValue = useCallback(
    (ids: Array<string | number>) => {
      const cleaned = uniq(ids).filter((id) => id !== null && id !== undefined && id !== 'undefined')

      if (!isPolymorphic) {
        if (hasMany) setValue(cleaned)
        else setValue(cleaned[0] ?? null)
        return
      }

      const targetSlug = Array.isArray(relationTo) ? relationTo[0] : relationTo

      if (hasMany) {
        const next: ValueWithRelation[] = cleaned.map((id) => ({
          relationTo: targetSlug,
          value: id,
        }))
        setValue(next)
      } else {
        const next: ValueWithRelation | null = cleaned[0]
          ? { relationTo: targetSlug, value: cleaned[0] }
          : null
        setValue(next)
      }
    },
    [hasMany, isPolymorphic, relationTo, setValue],
  )

  const removeID = useCallback(
    (id: string | number) => {
      writeValue(selectedIDs.filter((x) => x !== id))

      setSelected((prev) => prev.filter((p) => String(p.id) !== String(id)))
    },
    [selectedIDs, writeValue],
  )

  const addID = useCallback(
    (id: string | number, labelOverride?: string) => {
      if (id === null || id === undefined || id === 'undefined') return

      const strId = String(id)

      setSelected((prev) => {
        // prevent duplicates
        if (prev.some((p) => String(p.id) === strId)) {
          return prev
        }

        // try to resolve from current options
        const resolvedFromOptions = [...options, ...defaultOptions].find(
          (o) => String(o.id) === strId,
        )

        const next: Option =
          resolvedFromOptions ??
          (labelOverride != null
            ? { id, label: labelOverride }
            : { id, label: strId })

        return [...prev, next]
      })

      writeValue(hasMany ? [...selectedIDs, id] : [id])

      // reset UI state
      setQuery('')
      setOptions([])
      setDefaultOptions([])
      setOpen(false)
      setActiveIndex(-1)

      inputRef.current?.focus()
    },
    [options, defaultOptions, hasMany, selectedIDs, writeValue],
  )

  const clearAll = useCallback(() => {
    writeValue([])
    setSelected([])
    setQuery('')
    setOptions([])
    setDefaultOptions([])
    setOpen(false)
    setActiveIndex(-1)
  }, [writeValue])

  const menuOptions = query.trim() ? options : defaultOptions

  const fetchDocs = useCallback(
    async (collectionSlug: string, queryBody: any, signal: AbortSignal) => {
      const res = await fetch(adminCollectionURL(collectionSlug), {
        method: 'POST',
        credentials: 'include',
        signal,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Payload-HTTP-Method-Override': 'GET',
        },
        body: qs.stringify(queryBody),
      })

      const data = await res.json()
      return Array.isArray(data?.docs) ? data.docs : []
    },
    [adminCollectionURL],
  )

  const loadOptions = useCallback(
    async (searchTerm = '') => {
      if (!primaryCollectionSlug) return

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setLoading(true)

      try {
        const whereAnd: any[] = [{ id: { not_in: selectedIDs } }]

        if (searchTerm.trim()) {
          whereAnd.push({ [labelField]: { like: searchTerm.trim() } })
        }

        const queryBody = {
          depth: 0,
          draft: true,
          limit: maxResults,
          locale,
          select: { id: true, [labelField]: true },
          where: { and: whereAnd },
          sort: labelField,
        }

        const docs = await fetchDocs(primaryCollectionSlug, queryBody, controller.signal)

        const mapped = docs
          .map((doc: any) => {
            const id = doc?.id
            if (id === null || id === undefined) return null
            return { id, label: String(doc?.[labelField] ?? id) } as Option
          })
          .filter(Boolean) as Option[]

        if (searchTerm.trim()) {
          setOptions(mapped)
        } else {
          setDefaultOptions(mapped)
        }

        setOpen(true)
        setActiveIndex(mapped.length ? 0 : -1)
      } catch (e: any) {
        if (e?.name === 'AbortError') return

        if (searchTerm.trim()) {
          setOptions([])
        } else {
          setDefaultOptions([])
        }

        setOpen(false)
        setActiveIndex(-1)
      } finally {
        setLoading(false)
      }
    },
    [primaryCollectionSlug, selectedIDs, labelField, maxResults, locale, fetchDocs],
  )

  const activateControl = useCallback(() => {
    setIsControlActive(true)
    setOpen(true)

    if (!query.trim()) {
      void loadOptions('')
    }
  }, [query, loadOptions])

  const deactivateControl = useCallback(() => {
    setIsControlActive(false)
    setOpen(false)
    setActiveIndex(-1)
  }, [])

  // click outside closes/deactivates control
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!controlRootRef.current) return
      const target = event.target as Node

      if (!controlRootRef.current.contains(target)) {
        deactivateControl()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [deactivateControl])

  // hydrate selected IDs -> labels
  const selectedIDsKey = useMemo(() => selectedIDs.join('|'), [selectedIDs])
  useEffect(() => {
    if (!primaryCollectionSlug || selectedIDs.length === 0) {
      setSelected([])
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

      ; (async () => {
        try {
          const queryBody = {
            depth: 0,
            draft: true,
            limit: selectedIDs.length,
            locale,
            select: { id: true, [labelField]: true },
            where: { id: { in: selectedIDs } },
          }

          const docs = await fetchDocs(
            primaryCollectionSlug,
            queryBody,
            controller.signal,
          )

          setSelected((prev) => {
            // Map previous labels by ID (preserve optimistic labels)
            const prevById = new Map<string, string>(
              prev.map((item) => [String(item.id), item.label]),
            )

            return selectedIDs.map((id) => {
              const strId = String(id)

              const doc = docs.find((d: any) => String(d?.id) === strId)

              const fetchedLabel = doc?.[labelField]
              const existingLabel = prevById.get(strId)

              return {
                id,
                label: String(fetchedLabel ?? existingLabel ?? strId),
              }
            })
          })
        } catch (e: any) {
          if (e?.name === 'AbortError') return

          // preserve existing labels on failure
          setSelected((prev) => {
            const prevById = new Map<string, string>(
              prev.map((item) => [String(item.id), item.label]),
            )

            return selectedIDs.map((id) => {
              const strId = String(id)
              return {
                id,
                label: prevById.get(strId) ?? strId,
              }
            })
          })
        }
      })()

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryCollectionSlug, selectedIDsKey, labelField, locale, fetchDocs])

  // active + no query => load all unselected tags
  // active + query => filtered tags
  useEffect(() => {
    if (!isControlActive) return

    const term = query.trim()

    if (!term) {
      void loadOptions('')
      return
    }

    if (term.length < minChars) {
      setOptions([])
      setOpen(true)
      setActiveIndex(-1)
      return
    }

    void loadOptions(term)
  }, [query, minChars, isControlActive, loadOptions])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || menuOptions.length === 0) {
        if (e.key === 'ArrowDown' && menuOptions.length > 0) {
          setOpen(true)
          setActiveIndex(0)
          e.preventDefault()
        }
        return
      }

      if (e.key === 'ArrowDown') {
        setActiveIndex((i) => Math.min(i + 1, menuOptions.length - 1))
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((i) => Math.max(i - 1, 0))
        e.preventDefault()
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < menuOptions.length) {
          addID(menuOptions[activeIndex].id)
          e.preventDefault()
        }
      } else if (e.key === 'Escape') {
        deactivateControl()
        e.preventDefault()
      }

      if (e.key === 'Home') {
        setActiveIndex(0)
      }

      if (e.key === 'End') {
        setActiveIndex(menuOptions.length - 1)
      }
    },
    [open, menuOptions, activeIndex, addID, deactivateControl],
  )

  const onOpenCreate = useCallback(() => {
    setCreateError(null)
    setCreateTitle(query.trim() || '')
    setEditingTag(null)
    setIsCreateOpen(true)
  }, [query])

  const onOpenEdit = useCallback((opt: Option) => {
    setCreateError(null)
    setCreateTitle(opt.label)
    setEditingTag(opt)
    setIsCreateOpen(true)
  }, [])

  const onCloseModal = useCallback(() => {
    setIsCreateOpen(false)
    setEditingTag(null)
    setCreateError(null)
  }, [])

  const onSubmitTag = useCallback(async () => {
    const title = createTitle.trim()

    if (!title) {
      setCreateError('Title is required.')
      return
    }

    if (!primaryCollectionSlug) {
      setCreateError('Missing relationTo collection.')
      return
    }

    setCreateSaving(true)
    setCreateError(null)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const baseURL = adminCollectionURL(primaryCollectionSlug)

      const payload: any = { [createTitleField]: title }
      if (selectedSiteId != null) payload.site = selectedSiteId

      const res = await fetch(
        editingTag ? `${baseURL}/${editingTag.id}` : baseURL,
        {
          method: editingTag ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        },
      )

      const doc = await safeJson(res)

      if (doc?.id != null) {
        if (editingTag) {
          const nextLabel = String(doc?.[createTitleField] ?? title)

          setSelected((prev) =>
            prev.map((t) =>
              String(t.id) === String(doc.id)
                ? { ...t, label: nextLabel }
                : t
            ),
          )
        } else {
          const nextLabel = String(doc?.[createTitleField] ?? title)
          addID(doc.id, nextLabel)
        }

        onCloseModal()
        return
      }

      // confirm success via lookup if server responded badly after save
      if (editingTag) {
        const lookupQuery = {
          depth: 0,
          draft: true,
          limit: 1,
          locale,
          select: { id: true, [labelField]: true },
          where: { id: { equals: editingTag.id } },
        }

        const docs = await fetchDocs(primaryCollectionSlug, lookupQuery, controller.signal)
        const found = docs?.[0]

        if (found?.id != null) {
          const nextLabel = String(found?.[labelField] ?? title)
          setSelected((prev) =>
            prev.map((t) =>
              String(t.id) === String(found.id) ? { ...t, label: nextLabel } : t,
            ),
          )
          onCloseModal()
          return
        }
      } else {
        const whereAnd: any[] = [{ [createTitleField]: { equals: title } }]
        if (selectedSiteId != null) whereAnd.push({ 'site.id': { equals: selectedSiteId } })

        const lookupQuery = {
          depth: 0,
          draft: true,
          limit: 1,
          locale,
          select: { id: true, [labelField]: true },
          where: { and: whereAnd },
        }

        const docs = await fetchDocs(primaryCollectionSlug, lookupQuery, controller.signal)
        const found = docs?.[0]

        if (found?.id != null) {
          const nextLabel = String(found?.[labelField] ?? title)
          addID(found.id, nextLabel)
          onCloseModal()
          return
        }
      }

      throw new Error(`Unable to verify ${editingTag ? 'edit' : 'create'} result`)
    } catch (e: any) {
      if (e?.name === 'AbortError') return
      setCreateError(
        editingTag
          ? 'Unable to save tag.'
          : 'Unable to create tag. Please check permissions and required fields.',
      )
    } finally {
      setCreateSaving(false)
    }
  }, [
    createTitle,
    createTitleField,
    editingTag,
    primaryCollectionSlug,
    selectedSiteId,
    adminCollectionURL,
    fetchDocs,
    locale,
    labelField,
    addID,
    onCloseModal,
  ])

  const hasSelected = selected.length > 0;

  const describedBy = [description ? hintId : null, showError && errorMessage ? errorId : null, statusId]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div
        role="group"
        aria-labelledby={`label-${path}`}
        className={[
          'field-type',
          'relationship',
          'payload-uswds-relationship',
          showError && errorMessage ? 'payload-uswds-relationship--error' : null,
          !readOnly && 'relationship--allow-create',
        ]
          .filter(Boolean)
          .join(' ')}
        id={`field-${path.replace(/\./g, '__')}`}
      >
        <label className="usa-label field-label" id={`label-${path}`}>
          {fieldLabel}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>

        {showError && errorMessage && (
          <span className="usa-error-message" id={errorId} role="alert">
            {errorMessage}
          </span>
        )}

        {formProcessing && (
          <div className="usa-hint" id={statusId} aria-live="polite">
            Saving…
          </div>
        )}

        <div className="field-type__wrap">
          <div
            ref={controlRootRef}
            className="relationship__wrap"
            onFocusCapture={activateControl}
            onMouseDownCapture={activateControl}
          >
            <div className="react-select-container">
              <div className="react-select">
                <div
                  className={[
                    'rs__control',
                    isControlActive ? 'rs__control--is-focused' : null,
                    !hasSelected ? 'rs__control--is-empty' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div aria-live="polite" className="sr-only">{selected.length} tags selected</div>
                  <div className="value-container">
                    <div className="rs__value-container rs__value-container--is-multi rs__value-container--has-value">
                      {hasSelected &&
                        selected.map((opt) => (
                          <div key={String(opt.id)} className="multi-value draggable rs__multi-value">
                            <div className="relationship--multi-value-label" title={opt.label}>
                              <div className="relationship--multi-value-label__content">
                                <div className="relationship--multi-value-label__text">
                                  {opt.label}
                                </div>
                              </div>
                            </div>

                            {!readOnly && (
                              <>
                                <button
                                  aria-label={`Edit ${opt.label}`}
                                  className="relationship--multi-value-label__drawer-toggler"
                                  type="button"
                                  onClick={() => onOpenEdit(opt)}
                                >
                                  <aside
                                    aria-hidden="true"
                                    className="tooltip relationship--multi-value-label__tooltip tooltip--caret-center tooltip--position-top opacity-0"
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Edit</div>
                                  </aside>
                                  <aside
                                    className="tooltip relationship--multi-value-label__tooltip tooltip--caret-center tooltip--position-bottom"
                                    title="Edit"
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Edit</div>
                                  </aside>
                                  <svg
                                    className="relationship--multi-value-label__icon icon icon--edit"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      className="stroke"
                                      d="M9.68531 4.62938H5.2634C4.92833 4.62938 4.60698 4.76248 4.37004 4.99942C4.13311 5.23635 4 5.5577 4 5.89278V14.7366C4 15.0717 4.13311 15.393 4.37004 15.63C4.60698 15.8669 4.92833 16 5.2634 16H14.1072C14.4423 16 14.7636 15.8669 15.0006 15.63C15.2375 15.393 15.3706 15.0717 15.3706 14.7366V10.3147M13.7124 4.39249C13.9637 4.14118 14.3046 4 14.66 4C15.0154 4 15.3562 4.14118 15.6075 4.39249C15.8588 4.6438 16 4.98464 16 5.34004C16 5.69544 15.8588 6.03629 15.6075 6.28759L9.91399 11.9817C9.76399 12.1316 9.57868 12.2413 9.37515 12.3008L7.56027 12.8314C7.50591 12.8472 7.44829 12.8482 7.39344 12.8341C7.33859 12.8201 7.28853 12.7915 7.24849 12.7515C7.20845 12.7115 7.17991 12.6614 7.16586 12.6066C7.15181 12.5517 7.15276 12.4941 7.16861 12.4397L7.69924 10.6249C7.75896 10.4215 7.86888 10.2364 8.01888 10.0866L13.7124 4.39249Z"
                                      strokeLinecap="square"
                                    />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  className="relationship--multi-value-label__drawer-toggler"
                                  onClick={() => removeID(opt.id)}
                                  aria-label={`Remove ${opt.label}`}
                                >
                                  <aside
                                    aria-hidden="true"
                                    className="tooltip multi-value-remove__tooltip tooltip--caret-center tooltip--position-top opacity-0"
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Remove</div>
                                  </aside>
                                  <aside
                                    className="tooltip multi-value-remove__tooltip tooltip--caret-center tooltip--position-bottom"
                                    title="Remove"
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Remove</div>
                                  </aside>
                                  <svg
                                    className="multi-value-remove__icon icon icon--x"
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
                                </button>
                              </>
                            )}
                          </div>
                        ))}

                      <div className="rs__input-container">
                        <input
                          ref={inputRef}
                          id={`rel-${path}-input`}
                          className={[
                            'usa-input',
                            showError && errorMessage ? 'usa-input--error' : null,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={onKeyDown}
                          onFocus={activateControl}
                          onBlur={() => {
                            window.setTimeout(() => {
                              if (
                                controlRootRef.current &&
                                !controlRootRef.current.contains(document.activeElement)
                              ) {
                                deactivateControl()
                              }
                            }, 0)
                          }}
                          disabled={readOnly}
                          placeholder={loading ? 'Searching…' : `Select a value`}
                          autoComplete="off"
                          role="combobox"
                          aria-haspopup="listbox"
                          aria-autocomplete="list"
                          aria-expanded={open}
                          aria-controls={open ? listboxId : undefined}
                          aria-activedescendant={
                            activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
                          }
                          aria-describedby={describedBy}
                          aria-invalid={showError && Boolean(errorMessage) ? true : undefined}
                        />
                      </div>
                    </div>

                    <div className="rs__indicators">
                      <button
                        type="button"
                        className="clear-indicator"
                        aria-label="Clear all selected tags"
                        aria-hidden="true"
                        role="button"
                        tabIndex={0}
                        onClick={clearAll}
                      >
                        <svg
                          className="clear-indicator__icon icon icon--x"
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
                      </button>

                      <span className="rs__indicator-separator css-j4w2j1-indicatorSeparator" />

                      <button
                        className="dropdown-indicator"
                        aria-hidden="true"
                        aria-label="Toggle tag options"
                        aria-expanded={open}
                        type="button"
                        onClick={activateControl}
                      >
                        <svg
                          className="icon icon--chevron dropdown-indicator__icon"
                          height="100%"
                          viewBox="0 0 20 20"
                          width="100%"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="stroke"
                            d="M14 8L10 12L6 8"
                            strokeLinecap="square"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {open && menuOptions.length > 0 && (
                  <div className="rs__menu" role="listbox" aria-multiselectable="true" id={listboxId} aria-label={`label-${path}`}>
                    {menuOptions.map((opt, idx) => (
                      <div
                        key={String(opt.id)}
                        id={`${listboxId}-opt-${idx}`}
                        role="option"
                        aria-selected={idx === activeIndex}
                        aria-disabled={false}
                        className={[
                          'rs__option',
                          'payload-uswds-relationship__option',
                          idx === activeIndex ? 'payload-uswds-relationship__option--active' : null,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addID(opt.id)}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relationship-add-new" id="tags-add-new">
              <button
                className="relationship-add-new__add-button doc-drawer__toggler"
                type="button"
                aria-label="Add new Tag"
                onClick={onOpenCreate}
              >
                <aside
                  aria-hidden="true"
                  className="tooltip relationship-add-new__tooltip tooltip--caret-center tooltip--position-top opacity-0"
                >
                  <div className="tooltip-content" aria-hidden="true">{createLabel}</div>
                </aside>
                <aside
                  className="tooltip relationship-add-new__tooltip tooltip--caret-center tooltip--position-top"
                  title={createLabel}
                >
                  <div className="tooltip-content" aria-hidden="true">{createLabel}</div>
                </aside>
                <svg
                  className="icon icon--plus"
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="stroke"
                    d="M5.33333 9.99998H14.6667M9.99999 5.33331V14.6666"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </div>
          </div>

          {description && (
            <div className="field-description field-description-tags">{description}</div>
          )}
        </div>
      </div>

      {isCreateOpen && (
        <Modal
          isOpen={isCreateOpen}
          path={path}
          mode={editingTag ? 'edit' : 'create'}
          description="Tags used to organize and filter content across the site."
          titleValue={createTitle}
          error={createError}
          saving={createSaving}
          onTitleChange={setCreateTitle}
          onSubmit={onSubmitTag}
          onClose={onCloseModal}
        />
      )}
    </>
  )
}
