import type { Access } from 'payload'
import type { Where } from 'payload'

export const site: Access = ({ req: { user, data }, id }) => {
  if (!user) return false
  if (!user.sites.includes(data?.site)) {
    return false
  }
  const query: Where = {
    site: {
      in: .join()
    }
  }
  return query
}
