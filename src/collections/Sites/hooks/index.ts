import type { CollectionAfterChangeHook } from 'payload'
import { Site } from '@/payload-types'
import { v4 as uuidv4 } from 'uuid'
import {
    PutObjectCommand,
    S3Client,
    S3ServiceException,
  } from "@aws-sdk/client-s3";

import { encryptObjectValues } from '@/utilities/encryptor'

export const createSiteBot: CollectionAfterChangeHook<Site> = async ({
  doc, req, operation
}) => {
  const { payload } = req
  if (operation === 'create') {
    const bot = await payload.create({
      collection: 'users',
      data: {
        email: `cloud-gov-pages-operations+${doc.id}@gsa.gov`,
        sites: [
          {
            site: doc.id,
            role: 'bot',
          }
        ],
        sub: uuidv4(),
        enableAPIKey: true,
        apiKey: uuidv4(),
        selectedSiteId: doc.id
      },
      req // passing the request keeps this as a single transaction
    })

    // send this info to Pages
    if (process.env.PAGES_URL) {
        await fetch(`${process.env.PAGES_URL}/webhooks/site`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application-json'
            },
            body: encryptObjectValues({
                apiKey: bot.apiKey,
                siteId: doc.id,
                siteName: doc.name,
                org: doc.pagesOrg ?? '',
                userEmail: doc.initialManagerEmail,
            }, process.env.PAGES_ENCRYPTION_KEY)
        })
    }
  }
  return doc
}

export const createManager: CollectionAfterChangeHook<Site> = async ({
    doc, req, operation
}) => {
    const { payload } = req
  if (operation === 'create') {
    // note: it's possible this user already exists but that should be
    // handled by Users/hooks/testEmailUniqueness
    const bot = await payload.create({
      collection: 'users',
      data: {
        email: doc.initialManagerEmail,
        sites: [
          {
            site: doc.id,
            role: 'manager',
          }
        ],
        sub: uuidv4(),
        selectedSiteId: doc.id
      },
      req // passing the request keeps this as a single transaction
    })
  }
  return doc
}

export const saveInfoToS3: CollectionAfterChangeHook<Site> = async ({
    doc, req, operation,
}) => {
    const { payload } = req;
    if (operation === 'create') {
        if (process.env.SITE_METADATA_BUCKET) {
          // TODO: ideally the bot User would be passed via hook `context`
          // but it was seemingly being overwritten, potentially by the "trick"
          // return from Users/hooks/removeDummyUsers
            const bot = (await payload.find({
              collection: 'users',
              limit: 1,
              where: {
                and: [
                  { "sites.site.id": { equals: doc.id } },
                  { "sites.role": { equals: 'bot' } },
                ]
              },
              req
            })).docs[0]

            try {
                const client = new S3Client();
                const command = new PutObjectCommand({
                    Bucket: process.env.SITE_METADATA_BUCKET,
                    Key: `${doc.name}.json`,
                    Body: JSON.stringify({ ...doc, apiKey: bot.apiKey })
                })
                await client.send(command)
            } catch (error) {
                if (error instanceof S3ServiceException) {
                console.error(
                  `Error from S3 while uploading object. ${error.name}: ${error.message}`,
                );
              } else {
                throw (error)
              }
            }
        }
    }
}
