'use client'

import { useAuth, useForm } from '@payloadcms/ui'

const VirtualRoleField = () => {
  const { getData } = useForm()
  const { user } = useAuth()
  const data = getData()
  if (!user || user.isAdmin) return ''
  return (
    <div className="field-type email read-only" style={{ flex: '1 1 auto' }}>
      <label className="field-label " htmlFor="field-role">Role</label>
      <div className="field-type__wrap">
        <input disabled={true} id="field-role" type="text" name="role" value={data.sites[0].role} />
      </div>
    </div>
  )
}

export default VirtualRoleField
