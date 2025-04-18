import { Site, Post, User, Page, Event } from '@/payload-types'
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
    events: Event[],
    users: User[],
    sites: Site[],
    payload: BasePayload,
}
