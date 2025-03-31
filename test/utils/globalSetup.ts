import 'dotenv/config'
import { Client } from 'pg'
// TODO: installing our own pg version causing transaction errors in the test

// https://github.com/vitest-dev/vitest/blob/main/test/global-setup/globalSetup/default-export.js
let teardownHappened = false


export default async function () {

    const client = new Client({ connectionString: process.env.TEST_DATABASE_URI })
    await client.connect()

    async function clearDatabase() {
        await client.query('DELETE from users;').catch(e => console.log(e))
        await client.query('DELETE from sites;').catch(e => console.log(e))
        await client.query('DELETE from posts;').catch(e => console.log(e))
        await client.query('DELETE from pages;').catch(e => console.log(e))
    }

    // setup
    await clearDatabase()

    return async () => {
        if (teardownHappened) {
          throw new Error('teardown called twice')
        }
        // tear it down here
        teardownHappened = true
        await clearDatabase()
        return client.end()
      }
}
