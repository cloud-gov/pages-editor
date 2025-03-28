import 'dotenv/config'
import { Client } from 'pg'
// TODO: installing our own pg version causing transaction errors in the test

// https://github.com/vitest-dev/vitest/blob/main/test/global-setup/globalSetup/default-export.js
let teardownHappened = false

const client = new Client({ connectionString: process.env.TEST_DATABASE_URI })

export default async function () {

    async function clearDatabase() {
        await client.connect()
        await client.query('DELETE from users;')
        await client.query('DELETE from sites;')
        await client.query('DELETE from posts;')
        await client.query('DELETE from pages;')
        return client.end()
    }

    // setup
    await clearDatabase()

    return async () => {
        if (teardownHappened) {
          throw new Error('teardown called twice')
        }
        // tear it down here
        teardownHappened = true
        return clearDatabase()
      }
}
