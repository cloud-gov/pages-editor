import type { CollectionBeforeChangeHook, GlobalBeforeChangeHook } from 'payload'

export const populateUpdatedBy: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update' || !operation) {
    if (req.data && req.user) {
      data.updatedBy = req.user.id
    }
    return data
  }
}

export const populateGlobalUpdatedBy: GlobalBeforeChangeHook = ({ data, req }) => {
  if (req.data && req.user) {
    data.updatedBy = req.user.id
  }
  return data
}
