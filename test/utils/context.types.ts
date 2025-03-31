import { Site, Post, User, Page } from '@/payload-types'
import { BasePayload } from 'payload'
import type { Role } from '@/access/adminOrSite'

export interface LocalTestContext {
    tid: string | number,
    siteNames: string[],
    defaultUserRole: Role,
    defaultUserAdmin: boolean,
    testUser: User,
    posts: Post[],
    pages: Page[],
    users: User[],
    sites: Site[],
    payload: BasePayload,
}
