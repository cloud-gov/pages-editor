import type { Access, FieldAccess } from 'payload'

export const admin: Access = ({ req: { user } }) => {
  return user?.role === 'admin';
}

export const adminField: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin';
}
