import { Singlepage } from '@/payload-types'
import { Payload } from 'payload'

export const singlePageNames = ['Contact', 'About', 'History', 'Careers']

export const generateSinglePages =
  (payload: Payload, tid: string | number | Promise<string | number>) =>
  async (siteId: number, names: string[] = singlePageNames): Promise<Singlepage[]> => {
    const results = new Array<Singlepage>()

    for (const name of names) {
      const result = await payload.create({
        collection: 'singlepages',
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
