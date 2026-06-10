'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import './index.scss'

interface SubmissionDataFieldProps {
  path: string
  field: {
    label?: string
    admin?: {
      description?: string
    }
  }
}

/**
 * Flatten a nested object/array into dot-notation key-value pairs.
 * e.g., { address: { city: "NYC" } } => [["address.city", "NYC"]]
 */
function flattenObject(
  obj: unknown,
  prefix = ''
): Array<[string, unknown]> {
  const result: Array<[string, unknown]> = []

  if (obj === null || obj === undefined) {
    return result
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = prefix ? `${prefix}.${index}` : String(index)
      if (typeof item === 'object' && item !== null) {
        result.push(...flattenObject(item, key))
      } else {
        result.push([key, item])
      }
    })
  } else if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'object' && value !== null) {
        result.push(...flattenObject(value, fullKey))
      } else {
        result.push([fullKey, value])
      }
    })
  } else {
    result.push([prefix, obj])
  }

  return result
}

/**
 * Detect and format special value types: URLs, emails, dates.
 */
function formatValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="submission-data-field__empty">-</span>
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value !== 'string') {
    return String(value)
  }

  const trimmed = value.trim()

  // Detect URLs
  if (/^https?:\/\//i.test(trimmed)) {
    return (
      <a
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className="submission-data-field__link"
      >
        {trimmed}
      </a>
    )
  }

  // Detect email addresses
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return (
      <a
        href={`mailto:${trimmed}`}
        className="submission-data-field__link"
      >
        {trimmed}
      </a>
    )
  }

  // Detect ISO date strings (basic detection)
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(trimmed)) {
    const date = new Date(trimmed)
    if (!isNaN(date.getTime())) {
      return (
        <time dateTime={trimmed} className="submission-data-field__date">
          {date.toLocaleString()}
        </time>
      )
    }
  }

  return value
}

/**
 * Convert a dot-notation key to a human-readable label.
 * e.g., "contact_info.phone_number" => "Contact Info Phone Number"
 */
function keyToLabel(key: string): string {
  return key
    .split('.')
    .map((part) =>
      part
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
        .replace(/[_-]/g, ' ') // snake_case / kebab-case
        .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
    )
    .join(' > ')
}

const SubmissionDataField: React.FC<SubmissionDataFieldProps> = ({ path, field }) => {
  const { value } = useField<Record<string, unknown>>({ path })
  const label = field?.label ?? 'Submission Data'
  const description = field?.admin?.description

  const flattenedData = flattenObject(value)

  return (
    <div className="field-type submission-data-field">
      <label className="field-label">{label}</label>
      {description && (
        <div className="field-description">{description}</div>
      )}
      <div className="submission-data-field__table-wrapper">
        {flattenedData.length === 0 ? (
          <p className="submission-data-field__empty-message">No data submitted</p>
        ) : (
          <table className="submission-data-field__table">
            <thead>
              <tr>
                <th className="submission-data-field__th">Field</th>
                <th className="submission-data-field__th">Value</th>
              </tr>
            </thead>
            <tbody>
              {flattenedData.map(([key, val]) => (
                <tr key={key} className="submission-data-field__row">
                  <td className="submission-data-field__key">{keyToLabel(key)}</td>
                  <td className="submission-data-field__value">{formatValue(val)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default SubmissionDataField
