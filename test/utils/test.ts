import { test as vitest } from 'vitest'
import { LocalTestContext } from './context.types'

export const test = vitest<LocalTestContext>
