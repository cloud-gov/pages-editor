import {
  Category,
  Site,
  Leadership,
  Post,
  Report,
  User,
  Event,
  Media,
  News,
  Page,
  Policy,
} from '@/payload-types'
import { BasePayload } from 'payload'
import type { Role } from '@/access/adminOrSite'

export interface LocalTestContext {
  tid: string | number
  siteNames: string[]
  defaultUserRole: Role
  defaultUserAdmin: boolean
  testUser: User
  categories: Category[]
  events: Event[]
  leadership: Leadership[]
  media?: Media[]
  news: News[]
  posts: Post[]
  reports: Report[]
  pages: Page[]
  policies: Policy[]
  sites: Site[]
  users: User[]
  payload: BasePayload
}
