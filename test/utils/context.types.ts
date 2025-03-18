import { Site, Post, User, Page } from '@/payload-types'
import { BasePayload } from 'payload'

export interface LocalTestContext {
    tid: string | number,
    siteNames: string[],
    defaultUserRole: User["sites"][number]["role"],
    defaultUserAdmin: boolean,
    testUser: User,
    posts: Post[],
    pages: Page[],
    users: User[],
    sites: Site[],
    payload: BasePayload,
}
