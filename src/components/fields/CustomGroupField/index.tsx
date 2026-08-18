'use client'

import type { GroupFieldClient } from 'payload'
import { RenderFields } from '@payloadcms/ui'

import type { SanitizedFieldPermissions } from 'payload'

type Props = {
  field: GroupFieldClient
  path: string
  schemaPath: string
  permissions: 
    | SanitizedFieldPermissions
    | Record<string, SanitizedFieldPermissions>
  readOnly?: boolean
}

export function CustomGroupField({
  field,
  path,
  schemaPath,
  permissions,
  readOnly,
}: Props) {
  console.log(JSON.stringify(field, null, 2))
  const label = 
  typeof field.label === 'string'
    ? field.label
    : ''
  
  return (
    <div className="my-custom-group">
      <div className="my-custom-group__header">
        <h3>{label}</h3>
      </div>

      <RenderFields
        fields={field.fields}
        parentPath={path}
        parentSchemaPath={schemaPath}
        parentIndexPath=""
        permissions={
          permissions as
            | SanitizedFieldPermissions
            | Record<string, SanitizedFieldPermissions>
        }
        readOnly={readOnly}
      />
    </div>
  )
}
