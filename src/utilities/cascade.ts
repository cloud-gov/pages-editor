// TODO: remove once this is resolved
// https://github.com/payloadcms/payload/issues/11177
export const afterSchemaInit = [
    ({ schema }) => {
      const relations = ['relations_users_sites']
      relations.forEach((relation) => {
        const index = Symbol.for(`drizzle:PgInlineForeignKeys`)
        const fkeys = schema.relations[relation].table[index]
        // Loop through the foreign keys and modify them
        fkeys.forEach((foreignKey) => {
          foreignKey.onDelete = 'CASCADE'
          foreignKey.onUpdate = 'CASCADE'
        })
      })
      return schema
    },
  ]
