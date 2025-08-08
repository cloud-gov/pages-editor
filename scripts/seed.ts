import { getPayload } from 'payload'
import config from '@payload-config'
import { v4 as uuid } from 'uuid'
import Loader from './datasets'

const payload = await getPayload({ config })
const load = new Loader(payload)

async function seed() {
  // creates a base site and admin user
  const site = await payload.create({
    collection: 'sites',
    data: {
      name: 'admin-site',
      initialManagerEmail: 'admin@gsa.gov',
    },
  })
  await payload.update({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@gsa.gov',
      },
    },
    data: {
      isAdmin: true,
    },
  })

  console.log('\n')
  console.log('Local Dev Information')
  console.log('Site API keys for use with Pages Site Gantry development')
  console.log('Copy API key and save as `PAYLOAD_API_KEY` in Pages Site Gantry .env file')
  console.log('\n')
  // create two extra sites, each with a manager and user
  // note that managers are created automatically
  // TODO: explicity tie this to uaa.yml
  const siteNames = ['site1', 'site2']
  await Promise.all(
    siteNames.map(async (name) => {
      const site = await payload.create({
        collection: 'sites',
        data: {
          name,
          initialManagerEmail: `${name}manager@gsa.gov`,
        },
      })

      await load.runLoading(site.id)

      const bots = await payload.find({
        collection: 'users',
        select: {
          apiKey: true,
          sites: true,
        },
        where: {
          and: [{ enableAPIKey: { equals: true } }],
        },
      })

      const bot = bots.docs
        .map((doc) => ({
          // @ts-ignore
          sites: doc.sites.filter((s) => s.site.id === site.id),
          apiKey: doc.apiKey,
        }))
        .filter((x) => x.sites.length > 0)
        .flat()
        .pop()

      console.log(`Site ${site.name} - (ID: ${site.id})`)
      console.log(`  API KEY: ${bot?.apiKey}`)
      console.log('\n')

      return payload.create({
        collection: 'users',
        data: {
          email: `${name}user@gsa.gov`,
          sub: uuid(),
          sites: [
            {
              site,
              role: 'user',
            },
          ],
          selectedSiteId: site.id,
        },
      })
    }),
  )
}

await seed()
  .then(() => console.log('Database seeding complete'))
  .catch((err) => console.error(`Error seeding database ${err}`))

process.exit(0)
