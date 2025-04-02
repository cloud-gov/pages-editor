import { PayloadRequest } from 'payload'
import React from 'react'

const SiteLabel = ({ req }: { req: PayloadRequest }) => {
  if (!req) return null
  return req.user?.isAdmin || req.pathname === '/admin/account'
    ? 'Site Roles'
    : 'Role Selection'
}

export default SiteLabel
