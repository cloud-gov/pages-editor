import 'dotenv/config'
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
// TODO: installing our own pg version causing transaction errors in the test

// https://github.com/vitest-dev/vitest/blob/main/test/global-setup/globalSetup/default-export.js
let teardownHappened = false

export default async function () {

    async function clearDatabase() {
        await exec('yes | DATABASE_URI=$TEST_DATABASE_URI npm run payload migrate:fresh')
        return true
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
