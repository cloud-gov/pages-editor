import {
  Tag,
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
  SideNavigation,
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
  tags: Tag[]
  events: Event[]
  leadership: Leadership[]
  media?: Media[]
  news: News[]
  posts: Post[]
  reports: Report[]
  resources: Resource[]
  pages: Page[]
  sideNavigations: SideNavigation[]
  policies: Policy[]
  sites: Site[]
  users: User[]
  alerts: Alert[]
  footerSiteCollection: FooterSiteCollection[]
  payload: BasePayload
}
