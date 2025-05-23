import { Category, Site, Post, Report, User, Event, Media, News, Singlepage } from '@/payload-types'
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
  media?: Media[]
  news: News[]
  posts: Post[]
  reports: Report[]
  singlePages: Singlepage[]
  sites: Site[]
  users: User[]
  payload: BasePayload
}
