import {
  Tag,
  Site,
  User,
  Media,
  Page,
  SideNavigation,
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
  media?: Media[]
  pages: Page[]
  sideNavigations: SideNavigation[]
  sites: Site[]
  users: User[]
  alerts: Alert[]
  footerSiteCollection: FooterSiteCollection[]
  payload: BasePayload
}
