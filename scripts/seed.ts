import { getPayload } from 'payload';
import config from '@payload-config'
import { v4 as uuid } from 'uuid';

const payload = await getPayload({ config })

async function seed () {
  // creates a base site and admin user
  const site = await payload.create({
    collection: 'sites',
    data: {
        name: 'admin-site'
    }
  })
  await payload.create({
    collection: 'users',
    data: {
        email: 'admin@gsa.gov',
        sub: uuid(),
        sites: [{
            site,
            role: 'manager'
        }],
        selectedSiteId: site.id,
        isAdmin: true
    }
  })

  // create two extra sites, each with a manager and user
  // TODO: explicity tie this to uaa.yml
  const siteNames = ['site1', 'site2']
  await Promise.all(siteNames.map(async name => {
    const site = await payload.create({
      collection: 'sites',
      data: {
        name
      }
    })

    await payload.create({
      collection: 'users',
      data: {
        email: `${name}manager@gsa.gov`,
        sub: uuid(),
        sites: [{
          site,
          role: 'manager'
        }],
        selectedSiteId: site.id
      }
    })

    return payload.create({
      collection: 'users',
      data: {
        email: `${name}user@gsa.gov`,
        sub: uuid(),
        sites: [{
          site,
          role: 'user'
        }],
        selectedSiteId: site.id
      }
    })
  }))

}

await seed()
.then(() => console.log('database seeding complete'))
.catch((err) => console.error(`error seeding database ${err}`))

process.exit(0)
