'use client'
import { FieldLabel, useAuth } from "@payloadcms/ui"
import { User } from "@/payload-types"

type Props = { path: any }

export default (props: Props) => {
    console.log(props)
    const { path } = props
    const { user } = useAuth()
    return (
      <FieldLabel
        as="span"
        label={Boolean(user?.isAdmin) ? 'Sites' : 'Roles'}
        localized={false}
        path={path}
        required={true}
      />
    )
}

