import { expect } from 'vitest'

export const isAccessError = async (fnCall: Promise<any>) => {
    await expect(fnCall)
    .rejects
    .toThrowError('You are not allowed to perform this action')
}
