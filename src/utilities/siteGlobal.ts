import { adminField } from '@/access/admin';
import { getAdminOrSiteUser } from '@/access/adminOrSite';
import { SiteConfig } from '@/payload-types';
import type { GlobalConfig, CollectionConfig, Config } from 'payload'

export const createSiteGlobal = (
    config: GlobalConfig
  ): [GlobalConfig, CollectionConfig] => {
    const fields = config.fields;
    // hardcoded type assertion is required since we'll be writing `payload.find|create|update` and a valid collection name is required`
    // TODO: this collection should really be generated from the slug but it will break typing on the payload local
    // API response
    const collectionName = 'site-config-site-collection'

    const global: GlobalConfig = {
      ...config,
      admin: {
        ...config.admin,
        hidden: ({ user }) => Boolean(user && user.isAdmin),
        hideAPIURL: true,
      },
      hooks: {
        beforeChange: [
          async ({ req, data }) => {
            const siteId = req?.user?.selectedSiteId;

            const existing = (
              await req.payload.find({
                collection: collectionName,
                where: {
                  site: { equals: siteId },
                },
              })
            ).docs as SiteConfig[];

            if (existing[0]) {
              await req.payload.update({
                collection: collectionName,
                id: existing[0].id,
                data: {
                  ...data,
                  site: siteId,
                  // We want the collection to create its own ID, and to exclude the `globalType` field
                  id: undefined,
                  globalType: undefined,
                },
              });
            } else {
              await req.payload.create({
                collection: collectionName,
                data: {
                  ...data,
                  site: siteId,
                  id: undefined,
                  globalType: undefined,
                },
              });
            }

            return data;
          },
        ...(config.hooks?.beforeChange || []),
        ],
        beforeRead: [
          async ({ req }) => {
            const siteId = req?.user?.selectedSiteId;

            const globalSiteCollection = await req.payload.find({
              collection: collectionName,
              // The admin expects to fetch its own relationships, so we must force depth to 0,
              depth: 0,
              where: {
                site: { equals: siteId },
              },
            });

            if (globalSiteCollection.docs[0]) {
              return globalSiteCollection.docs[0];
            } else {
              return {};
            }
          },
         ...(config.hooks?.beforeRead || []),
        ],
      },
    };

    const collection: CollectionConfig = {
      ...config,
      slug: collectionName,
      graphQL: {},
      admin: {
        ...config.admin,
        hidden: ({ user }) => !(user && user.isAdmin)
      },
       // hooks should be passed to the global, not the collection, since the global is the main interface.
      hooks: {},
      // custom site field is passed here to manage ownership of collections.
      fields: [...fields, {
            name: 'site',
            type: 'relationship',
            relationTo: 'sites',
            required: true,
            access: {
              create: adminField,
              update: adminField,
              read: () => true,
            }
          },],
    };

    return [global, collection];
  };
