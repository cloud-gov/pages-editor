import { getPayload } from 'payload';
import config from '@payload-config'

const payload = await getPayload({ config })

async function seed () {
  // creates a base site and admin user
  const site = await payload.create({
    collection: 'sites',
    data: {
        name: 'admin-site'
    }
  })
  return payload.create({
    collection: 'users',
    data: {
        email: 'admin@gsa.gov',
        sites: [{
            site,
            role: 'manager'
        }],
        selectedSiteId: site.id,
        isAdmin: true
    }
  })
}

await seed()
.then(() => console.log('database seeding complete'))
.catch((err) => console.error(`error seeding database ${err}`))

process.exit(0)
