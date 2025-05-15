import type { FieldAccess } from 'payload'

export const admin = ({ req: { user } }) => {
  return Boolean(user?.isAdmin)
}

export const adminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.isAdmin)
}
