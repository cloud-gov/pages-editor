import {
  Category,
  Site,
  Leadership,
  Post,
  Report,
  Resource,
  User,
  Event,
  Media,
  News,
  Page,
  PageMenu,
  Policy,
  Alert,
  FooterSiteCollection,
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
  resources: Resource[]
  pages: Page[]
  pageMenus: PageMenu[]
  policies: Policy[]
  sites: Site[]
  users: User[]
  alerts: Alert[]
  footerSiteCollection: FooterSiteCollection[]
  payload: BasePayload
}
