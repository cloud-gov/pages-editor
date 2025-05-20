import { Site, Post, User, Event, Media, News } from '@/payload-types'
import { BasePayload } from 'payload'
import type { Role } from '@/access/adminOrSite'

export interface LocalTestContext {
    tid: string | number,
    siteNames: string[],
    defaultUserRole: Role,
    defaultUserAdmin: boolean,
    testUser: User,
    posts: Post[],
    events: Event[],
    media: Media[],
    news: News[],
    users: User[],
    sites: Site[],
    payload: BasePayload,
}
