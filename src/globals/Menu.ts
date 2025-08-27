// payload/globals/Menu.ts
import { GlobalConfig } from "payload";
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'

export const Menu: GlobalConfig = {
  slug: "menu",
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  fields: [
    {
      name: "items",
      type: "blocks",
      label: "Navigation Items",
      blocks: [
        {
          slug: "pageLink",
          labels: {
            singular: "Page Link",
            plural: "Page Links",
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "page",
              type: "relationship",
              relationTo: "pages",
              required: true,
            },
          ],
        },
        {
          slug: "collectionLink",
          labels: {
            singular: "Collection Link",
            plural: "Collection Links",
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "page",
              type: "relationship",
              relationTo: "collection-landing-pages",
              required: true,
            },
          ],
        },
        {
          slug: "dropdown",
          labels: {
            singular: "Dropdown",
            plural: "Dropdowns",
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "subItems",
              type: "array",
              fields: [
                {
                  name: "label",
                  type: "text",
                  required: true,
                },
                {
                  name: "page",
                  type: "relationship",
                  relationTo: "pages",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
