import type { CollectionBeforeChangeHook } from 'payload'
import type { User } from '@/payload-types'
import { v4 as uuidv4 } from 'uuid'

export const addSub: CollectionBeforeChangeHook<User> = async ({
  data, operation
}) => {
  if (operation === 'create') {
    data.sub = uuidv4()
  }
}
