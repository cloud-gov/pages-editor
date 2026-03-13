'use client'

import React from 'react'
import { CollectionType } from '@/payload-types'
import Link from 'next/link'
import { buildFilteredUrl } from '@/components/utilities'
import Section from './Section'
import CardLink from './CardLink'

export default function ListSiteCollectionTypes({
  collectionTypes: { docs = [] } = {},
}: {
  collectionTypes: { docs?: CollectionType[] }
}) {
  return (
    <Section
      title="Content Collections"
      action={
        <Link href="/admin/collections/collection-types/create">
          &oplus; Create New Collection Type
        </Link>
      }
    >
      {docs.length === 0 && (
        <div>
          <h3 className="text-bold">No collections found!</h3>
          <p className="padding-y-2">
            You don&apos;t have any collection types available. Create your first collection type to
            start adding content now! Think of collection types as newspost, reports, events, and
            anything else to fit your needs.{' '}
          </p>
          <Link href="/admin/collections/collection-types/create">
            Create your first collection type now.
          </Link>
        </div>
      )}
      {docs.length > 0 && (
        <div className="grid-row grid-gap-2">
          {docs.map((type) => {
            const filteredUrl = buildFilteredUrl(type.id)
            return (
              <CardLink
                key={type.id}
                href={filteredUrl}
                title={type.title}
                description={type.description || 'No description available.'}
                label={`View the ${type.title} items`}
                action={
                  <Link
                    className="font-sans-3xs"
                    href={`/admin/collections/collection-types/${type.id}`}
                  >
                    Edit
                  </Link>
                }
              />
            )
          })}
        </div>
      )}
    </Section>
  )
}
