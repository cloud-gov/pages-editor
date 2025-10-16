import { getPayload } from 'payload'
import config from '@payload-config'
import { v4 as uuid } from 'uuid'

const payload = await getPayload({ config })

async function bootstrap() {
  const adminEmail = process.argv.slice(2)[0]

  if (!adminEmail) {
    throw new Error('Admin email is required')
  }

  // See if admin-site exists
  let site = await payload
    .find({
      collection: 'sites',
      where: {
        name: { equals: 'admin-site' },
      },
    })
    .then((res) => res.docs[0])

  if (!site) {
    // Create site if it doesn't exist
    site = await payload.create({
      collection: 'sites',
      // @ts-ignore
      data: {
        name: 'admin-site',
      },
    })
  }

  let admin = await payload
    .find({
      collection: 'users',
      where: {
        email: { equals: adminEmail },
      },
    })
    .then((res) => res.docs[0])

  if (!admin) {
    // Create admin user
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        isAdmin: true,
        enableAPIKey: false,
        sites: [
          {
            site: site.id,
            role: 'manager',
          },
        ],
        sub: uuid(),
        selectedSiteId: site.id,
      },
    })
  }
}

await bootstrap()
  .then(() => console.log('Bootstrap complete'))
  .catch((err) => console.error(`Error running bootstrap ${err}`))

process.exit(0)
