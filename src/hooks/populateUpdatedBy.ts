import type { CollectionBeforeChangeHook } from "payload";

export const populateUpdatedBy: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (req.data && req.user) {
      data.updatedBy = req.user.id;
    }
    return data;
  }
}
