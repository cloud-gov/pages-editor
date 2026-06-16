'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth, useConfig, useField, useLocale } from '@payloadcms/ui'
import * as qs from 'qs-esm'
import { formatAdminURL } from 'payload/shared'
import './index.scss'
import { Modal } from '../../Modal'
import { FieldWrapper } from '../FieldWrapper'

type RelationTo = string | string[]

type ValueWithRelation = {
  relationTo: string
  value: string | number
}

type Option = {
  id: string | number
  label: string
}

type ModalFieldType = 'text' | 'textarea' | 'checkbox' | 'radio'

type ModalFieldOption = {
  label: string
  value: string
}

type ModalFieldConfig = {
  name: string
  label: string
  type: ModalFieldType
  required?: boolean
  options?: ModalFieldOption[]
  defaultValue?: unknown
  description?: string
}

type RelationshipFieldCustomConfig = {
  labelField?: string
  createTitleField?: string
  createLabel?: string
  createModalDescription?: string
  singularLabel?: string
  pluralLabel?: string
  placeholder?: string
  minChars?: number
  maxResults?: number
  allowCreate?: boolean
  allowInlineEdit?: boolean
  siteScoped?: boolean
  modalFields?: ModalFieldConfig[]
}

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr))

function resolveStaticText(value: unknown, fallback?: string): string | undefined {
  if (typeof value === 'string') return value
  return fallback
}

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
    const nextValue = (value as any).value
    if (nextValue === null || nextValue === undefined || nextValue === 'undefined') return []
    return [nextValue]
  }

  return []
}

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

function getDefaultValueForModalField(field: ModalFieldConfig): unknown {
  if (field.defaultValue !== undefined) return field.defaultValue

  switch (field.type) {
    case 'checkbox':
      return false
    case 'radio':
    case 'text':
    case 'textarea':
    default:
      return ''
  }
}

function buildInitialFormValues(
  fields: ModalFieldConfig[],
  seed?: Record<string, unknown>,
): Record<string, unknown> {
  const next: Record<string, unknown> = {}

  for (const modalField of fields) {
    if (seed && modalField.name in seed) {
      next[modalField.name] = seed[modalField.name]
      continue
    }

    next[modalField.name] = getDefaultValueForModalField(modalField)
  }

  return next
}

function buildSubmitPayload(
  fields: ModalFieldConfig[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  for (const modalField of fields) {
    let rawValue = values[modalField.name]

    if (modalField.type === 'checkbox') {
      payload[modalField.name] = Boolean(rawValue)
      continue
    }

    if (typeof rawValue === 'string') {
      rawValue = rawValue.trim()
    }

    payload[modalField.name] = rawValue
  }

  return payload
}

function getValidationError(
  fields: ModalFieldConfig[],
  values: Record<string, unknown>,
): string | null {
  for (const modalField of fields) {
    if (!modalField.required) continue

    const rawValue = values[modalField.name]

    if (modalField.type === 'checkbox') {
      if (!Boolean(rawValue)) {
        return `${modalField.label} is required.`
      }
      continue
    }

    if (typeof rawValue === 'string') {
      if (!rawValue.trim()) {
        return `${modalField.label} is required.`
      }
      continue
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return `${modalField.label} is required.`
    }
  }

  return null
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

  const custom = (field?.admin?.custom ?? {}) as RelationshipFieldCustomConfig

  const rawFieldLabel = labelProp ?? field?.label
  const fieldLabel =
    resolveStaticText(rawFieldLabel, field?.name ?? 'Relationship') ?? 'Relationship'

  const description = resolveStaticText(field?.admin?.description)

  const labelField: string = custom.labelField ?? collectionConfig?.admin?.useAsTitle ?? 'id'
  const createTitleField: string = custom.createTitleField ?? 'title'
  const createLabel: string = custom.createLabel ?? 'Create new'
  const createModalDescription: string | undefined = custom.createModalDescription
  const siteScoped: boolean = custom.siteScoped ?? false

  const singularLabel: string =
    custom.singularLabel ?? (typeof fieldLabel === 'string' ? fieldLabel : 'Item')

  const pluralLabel: string = custom.pluralLabel ?? `${singularLabel}s`
  const inputPlaceholder: string = custom.placeholder ?? 'Select a value'
  const minChars: number = custom.minChars ?? 2
  const maxResults: number = custom.maxResults ?? 10
  const allowCreate: boolean = !readOnly && (custom.allowCreate ?? true)
  const allowInlineEdit: boolean = !readOnly && (custom.allowInlineEdit ?? false)

  const resolvedModalFields = useMemo<ModalFieldConfig[]>(() => {
    if (Array.isArray(custom.modalFields) && custom.modalFields.length > 0) {
      return custom.modalFields
    }

    return [
      {
        name: createTitleField,
        label: singularLabel,
        type: 'text',
        required: true,
      },
    ]
  }, [custom.modalFields, createTitleField, singularLabel])

  const selectedIDs = useMemo(() => normalizeToIDs(value, hasMany), [value, hasMany])

  const [selected, setSelected] = useState<Option[]>([])
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [defaultOptions, setDefaultOptions] = useState<Option[]>([])

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isControlActive, setIsControlActive] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Option | null>(null)
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSaving, setModalSaving] = useState(false)

  const controlRootRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const sanitizedPath = useMemo(() => path.replace(/\./g, '__'), [path])
  const id = useMemo(() => `field-${sanitizedPath}`, [sanitizedPath])
  const wrapperHintId = useMemo(() => `${id}-hint`, [id])
  const wrapperErrorId = useMemo(() => `${id}-error`, [id])
  const listboxId = useMemo(() => `rel-${path}-listbox`, [path])
  const statusId = useMemo(() => `rel-${path}-status`, [path])

  const adminCollectionURL = useCallback(
    (collectionSlug: string) =>
      formatAdminURL({
        apiRoute,
        path: `/${collectionSlug}`,
      }),
    [apiRoute],
  )

  const menuOptions = query.trim() ? options : defaultOptions
  const hasSelected = selected.length > 0

  const setFormValue = useCallback((name: string, nextValue: unknown) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }, [])

  const writeValue = useCallback(
    (ids: Array<string | number>) => {
      const cleaned = uniq(ids).filter(
        (nextID) => nextID !== null && nextID !== undefined && nextID !== 'undefined',
      )

      if (!isPolymorphic) {
        if (hasMany) {
          setValue(cleaned)
        } else {
          setValue(cleaned[0] ?? null)
        }
        return
      }

      const targetSlug = Array.isArray(relationTo) ? relationTo[0] : relationTo

      if (hasMany) {
        const nextValue: ValueWithRelation[] = cleaned.map((nextID) => ({
          relationTo: targetSlug,
          value: nextID,
        }))
        setValue(nextValue)
      } else {
        const nextValue: ValueWithRelation | null = cleaned[0]
          ? {
              relationTo: targetSlug,
              value: cleaned[0],
            }
          : null

        setValue(nextValue)
      }
    },
    [hasMany, isPolymorphic, relationTo, setValue],
  )

  const removeID = useCallback(
    (nextID: string | number) => {
      writeValue(selectedIDs.filter((existingID) => String(existingID) !== String(nextID)))
      setSelected((prev) => prev.filter((item) => String(item.id) !== String(nextID)))
    },
    [selectedIDs, writeValue],
  )

  const addID = useCallback(
    (nextID: string | number, labelOverride?: string) => {
      if (nextID === null || nextID === undefined || nextID === 'undefined') return

      const normalized = String(nextID)

      setSelected((prev) => {
        if (prev.some((item) => String(item.id) === normalized)) {
          return prev
        }

        const found = [...options, ...defaultOptions].find(
          (option) => String(option.id) === normalized,
        )

        const nextOption: Option =
          found ??
          (labelOverride != null
            ? { id: nextID, label: labelOverride }
            : { id: nextID, label: normalized })

        return hasMany ? [...prev, nextOption] : [nextOption]
      })

      writeValue(hasMany ? [...selectedIDs, nextID] : [nextID])

      setQuery('')
      setOptions([])
      setDefaultOptions([])
      setOpen(false)
      setActiveIndex(-1)

      inputRef.current?.focus()
    },
    [defaultOptions, hasMany, options, selectedIDs, writeValue],
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

  const fetchDocs = useCallback(
    async (collectionSlug: string, queryBody: Record<string, unknown>, signal: AbortSignal) => {
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

      const data = await safeJson(res)
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

        const queryBody: Record<string, unknown> = {
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
            const nextID = doc?.id
            if (nextID === null || nextID === undefined) return null

            return {
              id: nextID,
              label: String(doc?.[labelField] ?? nextID),
            } as Option
          })
          .filter(Boolean) as Option[]

        if (searchTerm.trim()) {
          setOptions(mapped)
        } else {
          setDefaultOptions(mapped)
        }

        setOpen(true)
        setActiveIndex(mapped.length > 0 ? 0 : -1)
      } catch (error: any) {
        if (error?.name === 'AbortError') return

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
    [fetchDocs, labelField, locale, maxResults, primaryCollectionSlug, selectedIDs],
  )

  const activateControl = useCallback(() => {
    if (readOnly) return

    setIsControlActive(true)
    setOpen(true)

    if (!query.trim()) {
      void loadOptions('')
    }
  }, [loadOptions, query, readOnly])

  const deactivateControl = useCallback(() => {
    setIsControlActive(false)
    setOpen(false)
    setActiveIndex(-1)
  }, [])

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

  const selectedIDsKey = useMemo(() => selectedIDs.join('|'), [selectedIDs])

  useEffect(() => {
    if (!primaryCollectionSlug || selectedIDs.length === 0) {
      setSelected([])
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    ;(async () => {
      try {
        const queryBody: Record<string, unknown> = {
          depth: 0,
          draft: true,
          limit: selectedIDs.length,
          locale,
          select: { id: true, [labelField]: true },
          where: { id: { in: selectedIDs } },
        }

        const docs = await fetchDocs(primaryCollectionSlug, queryBody, controller.signal)

        setSelected((prev) => {
          const prevByID = new Map<string, string>(
            prev.map((item) => [String(item.id), item.label]),
          )

          return selectedIDs.map((nextID) => {
            const normalized = String(nextID)
            const doc = docs.find((candidate: any) => String(candidate?.id) === normalized)
            const fetchedLabel = doc?.[labelField]
            const existingLabel = prevByID.get(normalized)

            return {
              id: nextID,
              label: String(fetchedLabel ?? existingLabel ?? normalized),
            }
          })
        })
      } catch (error: any) {
        if (error?.name === 'AbortError') return

        setSelected((prev) => {
          const prevByID = new Map<string, string>(
            prev.map((item) => [String(item.id), item.label]),
          )

          return selectedIDs.map((nextID) => {
            const normalized = String(nextID)

            return {
              id: nextID,
              label: prevByID.get(normalized) ?? normalized,
            }
          })
        })
      }
    })()

    return () => controller.abort()
  }, [fetchDocs, labelField, locale, primaryCollectionSlug, selectedIDs, selectedIDsKey])

  useEffect(() => {
    if (!isControlActive || readOnly) return

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
  }, [isControlActive, loadOptions, minChars, query, readOnly])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || menuOptions.length === 0) {
        if (event.key === 'ArrowDown' && menuOptions.length > 0) {
          setOpen(true)
          setActiveIndex(0)
          event.preventDefault()
        }
        return
      }

      if (event.key === 'ArrowDown') {
        setActiveIndex((prev) => Math.min(prev + 1, menuOptions.length - 1))
        event.preventDefault()
        return
      }

      if (event.key === 'ArrowUp') {
        setActiveIndex((prev) => Math.max(prev - 1, 0))
        event.preventDefault()
        return
      }

      if (event.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < menuOptions.length) {
          addID(menuOptions[activeIndex].id)
          event.preventDefault()
        }
        return
      }

      if (event.key === 'Escape') {
        deactivateControl()
        event.preventDefault()
        return
      }

      if (event.key === 'Home') {
        setActiveIndex(0)
        return
      }

      if (event.key === 'End') {
        setActiveIndex(menuOptions.length - 1)
      }
    },
    [activeIndex, addID, deactivateControl, menuOptions, open],
  )

  const openCreateModal = useCallback(() => {
    const initialSeed: Record<string, unknown> = {}
    const queryTrimmed = query.trim()

    if (queryTrimmed) {
      initialSeed[createTitleField] = queryTrimmed
    }

    setEditingItem(null)
    setModalError(null)
    setFormValues(buildInitialFormValues(resolvedModalFields, initialSeed))
    setIsModalOpen(true)
  }, [createTitleField, query, resolvedModalFields])

  const hydrateEditValues = useCallback(
    async (item: Option) => {
      if (!primaryCollectionSlug) return

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const selectShape: Record<string, true> = { id: true }
        for (const modalField of resolvedModalFields) {
          selectShape[modalField.name] = true
        }
        selectShape[labelField] = true

        const docs = await fetchDocs(
          primaryCollectionSlug,
          {
            depth: 0,
            draft: true,
            limit: 1,
            locale,
            select: selectShape,
            where: { id: { equals: item.id } },
          },
          controller.signal,
        )

        const found = docs?.[0]
        if (!found) return

        const seededValues: Record<string, unknown> = {}
        for (const modalField of resolvedModalFields) {
          if (found[modalField.name] !== undefined) {
            seededValues[modalField.name] = found[modalField.name]
          }
        }

        setFormValues((prev) => ({
          ...buildInitialFormValues(resolvedModalFields, seededValues),
          ...prev,
          ...seededValues,
        }))
      } catch (error: any) {
        if (error?.name === 'AbortError') return
      }
    },
    [fetchDocs, labelField, locale, primaryCollectionSlug, resolvedModalFields],
  )

  const openEditModal = useCallback(
    (item: Option) => {
      const seed: Record<string, unknown> = {
        [createTitleField]: item.label,
      }

      setEditingItem(item)
      setModalError(null)
      setFormValues(buildInitialFormValues(resolvedModalFields, seed))
      setIsModalOpen(true)

      void hydrateEditValues(item)
    },
    [createTitleField, hydrateEditValues, resolvedModalFields],
  )

  const onCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingItem(null)
    setModalError(null)
    setModalSaving(false)
  }, [])

  const onSubmitItem = useCallback(async () => {
    if (modalSaving) return

    const validationError = getValidationError(resolvedModalFields, formValues)
    if (validationError) {
      setModalError(validationError)
      return
    }

    if (!primaryCollectionSlug) {
      setModalError('Missing relationTo collection.')
      return
    }

    setModalSaving(true)
    setModalError(null)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const baseURL = adminCollectionURL(primaryCollectionSlug)
      const payload = buildSubmitPayload(resolvedModalFields, formValues)

      if (siteScoped && selectedSiteId != null && payload.site == null) {
        payload.site = selectedSiteId
      }

      if (
        createTitleField &&
        payload[createTitleField] == null &&
        typeof formValues[createTitleField] === 'string'
      ) {
        payload[createTitleField] = formValues[createTitleField]
      }

      const res = await fetch(editingItem ? `${baseURL}/${editingItem.id}` : baseURL, {
        method: editingItem ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      const raw = await res.text()
      
      let doc
      try {
        doc = JSON.parse(raw)
      } catch {
        doc = raw
      }

      if (!res.ok) {
        const message =
          doc?.errors?.[0]?.message ||
          doc?.message ||
          (editingItem
            ? `Unable to save ${singularLabel.toLowerCase()}.`
            : `Unable to create ${singularLabel.toLowerCase()}`
          )
        throw new Error(message)
      }

      const resolvedDoc = doc?.doc ?? doc

      const docID = resolvedDoc?.id

      if (docID === null || docID === undefined) {
        throw new Error(
          'Missing created document ID'
        )
      }

      const nextLabel = String(
        resolvedDoc?.[labelField] ??
          resolvedDoc?.[createTitleField] ??
          payload[labelField] ??
          payload[createTitleField] ??
          docID,
      )

      if (editingItem) {
        setSelected((prev) =>
          prev.map((item) =>
            String(item.id) === String(docID)
              ? {
                  id: docID,
                  label: nextLabel,
                }
              : item,
          ),
        )
      } else {
        addID(docID, nextLabel)
      }

      onCloseModal()
    } catch (error: any) {
      if (error?.name === 'AbortError') return

      setModalError(
        error?.message ||
          (editingItem
            ? `Unable to save ${singularLabel.toLowerCase()}.`
            : `Unable to create ${singularLabel.toLowerCase()}.`),
      )
    } finally {
      setModalSaving(false)
    }
  }, [
    addID,
    adminCollectionURL,
    createTitleField,
    editingItem,
    formValues,
    labelField,
    modalSaving,
    onCloseModal,
    primaryCollectionSlug,
    resolvedModalFields,
    selectedSiteId,
    singularLabel,
    siteScoped,
  ])

  const describedBy = [
    description ? wrapperHintId : null,
    showError && errorMessage ? wrapperErrorId : null,
    formProcessing ? statusId : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <FieldWrapper
        id={id}
        label={fieldLabel}
        required={required}
        description={description}
        error={showError ? errorMessage : undefined}
        variant={field?.admin?.position === 'sidebar' ? 'sidebar' : 'default'}
        type="relationship"
      >
        {formProcessing ? (
          <div className="usa-hint payload-field__status" id={statusId} aria-live="polite">
            Saving…
          </div>
        ) : null}

        <div
          ref={controlRootRef}
          className={[
            'relationship__wrap',
            allowCreate ? 'relationship--allow-create' : null,
            showError && errorMessage ? 'payload-uswds-relationship--error' : null,
          ]
            .filter(Boolean)
            .join(' ')}
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
                <div aria-live="polite" className="sr-only">
                  {selected.length} {pluralLabel.toLowerCase()} selected
                </div>

                <div className="value-container">
                  <div className={`rs__value-container rs__value-container--has-value ${hasMany ? 'rs__value-container--is-multi' : ''}`}
                  >
                    {hasSelected &&
                      selected.map((item) => (
                        <div key={String(item.id)} className={`${hasMany ? 'multi-value draggable rs__multi-value' : 'relationship--single-value rs__single-value '}`}>
                          <div className={` ${hasMany ? 'relationship--multi-value-label' : 'relationship--single-value__label'}`} title={item.label}>
                            <div className={`${hasMany ? 'relationship--multi-value-label__content' : 'relationship--single-value__label-text'}`}>
                              <div className={`${hasMany ? 'relationship--multi-value-label__text' : 'relationship--single-value__text'}`}>

                                {item.label}
                                {allowInlineEdit && !hasMany &&
                                
                                  <button
                                  type="button"
                                  className={`${hasMany ? 'relationship--multi-value-label__drawer-toggler' : 'relationship--single-value__drawer-toggler'}`}
                                  aria-label={`Edit ${item.label}`}
                                  onClick={() => openEditModal(item)}
                                >
                                  <aside
                                    aria-hidden="true"
                                    className={`tooltip relationship---value-label__tooltip tooltip--caret-center tooltip--position-top opacity-0`}
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Edit</div>
                                  </aside>
                                  <aside
                                    className={`tooltip relationship--${hasMany ? 'multi' : 'single'}-value-label__tooltip tooltip--caret-center tooltip--position-bottom`}
                                    title="Edit"
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Edit</div>
                                  </aside>
                                  <svg
                                    className={`relationship--${hasMany ? 'multi' : 'single'}-value-label__icon icon icon--edit`}
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
                                }
                              </div>
                            </div>
                          </div>

                          {!readOnly && hasMany ? (
                            <>
                              {allowInlineEdit ? (
                                <button
                                  type="button"
                                  className={`${hasMany ? 'relationship--multi-value-label__drawer-toggler' : 'relationship--single-value__drawer-toggler'}`}
                                  aria-label={`Edit ${item.label}`}
                                  onClick={() => openEditModal(item)}
                                >
                                  <aside
                                    aria-hidden="true"
                                    className={`tooltip relationship---value-label__tooltip tooltip--caret-center tooltip--position-top opacity-0`}
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Edit</div>
                                  </aside>
                                  <aside
                                    className={`tooltip relationship--${hasMany ? 'multi' : 'single'}-value-label__tooltip tooltip--caret-center tooltip--position-bottom`}
                                    title="Edit"
                                  >
                                    <div className="tooltip-content" aria-hidden="true">Edit</div>
                                  </aside>
                                  <svg
                                    className={`relationship--${hasMany ? 'multi' : 'single'}-value-label__icon icon icon--edit`}
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
                              ) : null}

                              {hasMany && 
                                <button
                                type="button"
                                className="relationship--multi-value-label__drawer-toggler"
                                aria-label={`Remove ${item.label}`}
                                onClick={() => removeID(item.id)}
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
                              }
                            </>
                          ) : null}
                        </div>
                      ))}

                    <div className="rs__input-container">
                      <input
                        ref={inputRef}
                        id={`rel-${path}-input`}
                        className={['usa-input border-width-0', showError && errorMessage ? 'usa-input--error' : null]
                          .filter(Boolean)
                          .join(' ')}
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
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
                        placeholder={loading ? 'Searching…' : inputPlaceholder}
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
                      aria-label={`Clear all selected ${pluralLabel.toLowerCase()}`}
                      onClick={clearAll}
                      disabled={readOnly || !hasSelected}
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

                    <span className="rs__indicator-separator" />

                    <button
                      type="button"
                      className="dropdown-indicator"
                      aria-label={`Toggle ${pluralLabel.toLowerCase()} options`}
                      aria-expanded={open}
                      onClick={activateControl}
                      disabled={readOnly}
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

              {open && menuOptions.length > 0 ? (
                <div
                  className="rs__menu"
                  role="listbox"
                  aria-multiselectable={hasMany ? 'true' : 'false'}
                  id={listboxId}
                  aria-label={fieldLabel}
                >
                  {menuOptions.map((item, index) => (
                    <div
                      key={String(item.id)}
                      id={`${listboxId}-opt-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      aria-disabled={false}
                      className={[
                        'rs__option',
                        'payload-uswds-relationship__option',
                        index === activeIndex ? 'payload-uswds-relationship__option--active' : null,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => addID(item.id, item.label)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {allowCreate ? (
            <div className={`relationship-add-new ${!hasMany && ' height-5'}`} id={`${sanitizedPath}-add-new`}>
              <button
                type="button"
                className="relationship-add-new__add-button doc-drawer__toggler"
                aria-label={createLabel}
                onClick={openCreateModal}
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
          ) : null}
        </div>

        {isModalOpen && createModalDescription ? (
          <div className="usa-hint relationship-modal-description">{createModalDescription}</div>
        ) : null}

        {isModalOpen && modalError ? (
          <div className="usa-error-message" aria-live="polite">
            {modalError}
          </div>
        ) : null}

        {isModalOpen ? (
          <Modal
            isOpen={isModalOpen}
            path={path}
            mode={editingItem ? 'edit' : 'create'}
            fields={resolvedModalFields}
            values={formValues}
            onChange={setFormValue}
            onSubmit={onSubmitItem}
            onClose={onCloseModal}
          />
        ) : null}
      </FieldWrapper>
    </>
  )
}
