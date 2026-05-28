import type { TextField } from 'payload'

type UswdsColorFieldOptions = {
  name: string
  label?: string
  defaultValue?: string
}

export const uswdsColorField = ({
  name,
  label,
  defaultValue,
}: UswdsColorFieldOptions): TextField => ({
  name,
  type: 'text',
  ...(label !== undefined ? { label } : {}),
  ...(defaultValue !== undefined ? { defaultValue } : {}),
  admin: {
    components: {
      Field: '@/fields/styles/UswdsColorSelect#UswdsColorSelect',
    },
  },
})

export { uswdsColorTokens, findTokenByHex } from './tokens'
export type { UswdsColorToken } from './tokens'
