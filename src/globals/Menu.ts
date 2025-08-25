// payload/globals/Menu.ts
import { GlobalConfig } from "payload";

export const Menu: GlobalConfig = {
  slug: "menu",
  fields: [
    {
      name: "items",
      type: "blocks",
      label: "Navigation Items",
      blocks: [
        {
          slug: "navItem",
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
          slug: "externalLink",
          labels: {
            singular: "Custom Link",
            plural: "Custom Links",
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "url",
              type: "text",
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
