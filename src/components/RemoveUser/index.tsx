'use client'
import { User } from "@/payload-types";
import { isRoleForSelectedSite } from "@/utilities/access";
import { siteIdHelper } from "@/utilities/idHelper"
import { useAuth, useDocumentInfo } from "@payloadcms/ui"
import { useRouter } from 'next/navigation';

const RemoveUser = () => {
  const { user } : { user?: User | null }= useAuth()
  const { id: userId } = useDocumentInfo()
  const router = useRouter()
  if (!user) return null
  if (user.isAdmin) return null
  const siteId = user.selectedSiteId

  if (!isRoleForSelectedSite(user, ['manager'])) return null

  const removeUser = async function () {
    await fetch(`${process.env.PUBLIC_URL}/api/removeUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, siteId })
    })
    router.push('/admin/collections/users?limit=10')
  }

  return (
    <button onClick={removeUser} type="button" className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup">
      <span className="btn__content">Remove User</span>
    </button>
  )
}

export default RemoveUser
