import { getPayload } from 'payload'
import config from '@payload-config'
import { v4 as uuid } from 'uuid'
import Loader from './datasets'

const payload = await getPayload({ config })
const load = new Loader(payload)

const BOT_API_KEYS = {
  site1: 'df301adb-6d26-4688-bd17-9454a2da62bd',
  site2: 'a6f81491-939b-456c-980a-4e0fb7461edf',
}

async function seed() {
  // creates a base site and admin user
  await payload.create({
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
          bucket: `pages-${name}-bucket`,
        },
      })

      await load.runLoading(site.id)

      // Create consistent bot API key for the sites to improve local development experience
      const botApiKey = BOT_API_KEYS[name]
      const staticBot = await payload.create({
        collection: 'users',
        data: {
          email: `cloud-gov-pages-operations+${site.id}@gsa.gov`,
          sites: [
            {
              site: site.id,
              role: 'bot',
            },
          ],
          sub: botApiKey,
          enableAPIKey: true,
          apiKey: botApiKey,
          selectedSiteId: site.id,
        },
      })

      console.log(`Site ${site.name} - (ID: ${site.id})`)
      console.log(`  API KEY: ${staticBot.apiKey}`)
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
