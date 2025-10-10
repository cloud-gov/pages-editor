import { Page } from '@/payload-types'
import { Payload } from 'payload'
import policies from './datasets/policies'

export const generatePolicies =
  (payload: Payload, tid: string | number | Promise<string | number>) =>
  async (siteId: number): Promise<Page[]> => {
    const sitePolicies = policies(siteId)

    return Promise.all(
      sitePolicies.map((data) =>
        payload.create({
          collection: 'policies',
          req: { transactionID: tid },
          data,
        }),
      ),
    )
  }

export const singlePageNames = ['Contact', 'About', 'History', 'Careers']

export const generateSinglePages =
  (payload: Payload, tid: string | number | Promise<string | number>) =>
  async (siteId: number, names: string[] = singlePageNames): Promise<Page[]> => {
    const results = new Array<Page>()

    for (const name of names) {
      const result = await payload.create({
        collection: 'pages',
        req: { transactionID: tid },
        data: {
          title: `${name}`,
          slug: name,
          site: siteId,
        },
      })
      results.push(result)
    }

    return results
  }
