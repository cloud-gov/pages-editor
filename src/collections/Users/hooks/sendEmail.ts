import type { CollectionAfterChangeHook } from "payload"
import type { User } from "@/payload-types"

export const sendEmail: CollectionAfterChangeHook<User> = async ({
  doc, req: { payload }, operation
}) => {
  if (operation === 'create') {
    // email the user
    // payload.sendEmail
  }
  return doc
}
