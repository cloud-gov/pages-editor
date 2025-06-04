import { Page } from '@/payload-types'
import { Payload } from 'payload'

export const policyNames = [
  'Accessibility Statement',
  'FOIA',
  'Equal Employment',
  'External Links',
  'Privacy Policy',
  'Vulnerability Disclosure Policy',
]

export const generatePolicies =
  (payload: Payload, tid: string | number | Promise<string | number>) =>
  async (siteId: number, names: string[] = policyNames): Promise<Page[]> => {
    const results = new Array<Page>()

    for (const name of names) {
      const result = await payload.create({
        collection: 'policies',
        req: { transactionID: tid },
        data: {
          title: `${name}`,
          slug: name,
          site: siteId,
          label: `${name}`,
        },
      })
      results.push(result)
    }

    return results
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
          label: `${name}`,
        },
      })
      results.push(result)
    }

    return results
  }
