import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { admin } from '@/access/admin'
import { siteField } from '@/fields'
export const PublishedBuildStatus: CollectionConfig = {
  slug: 'published-build-status',
  admin:{
    group:'Site Management',
    useAsTitle:'completedAt',
    description:'Build Status List',
  },
  access:{
     read: getAdminOrSiteUser('published-build-status', ['manager', 'user', 'bot']),
     update: admin,
     create: admin,
     delete: admin,
  },
  defaultSort:['-completedAt'],
  fields:[
    {
      name:'pagesBuildId',
      type:'number',
    },
    {
      name:'completedAt',
      type:'date',
    },
    {
      name:'state',
      type:'text',
    },

    {
      name:'startedAt',
      type:'date',
    },
    {
      name:'error',
      type:'text',
    },
    siteField,
  ]
}
