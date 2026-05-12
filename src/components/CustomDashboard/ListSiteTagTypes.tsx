'use client'

import React from 'react'
import { TagType } from '@/payload-types'
import Link from 'next/link'
import { buildFilteredUrl } from '@/components/utilities'
import Section from './Section'
import CardLink from './CardLink'

export default function ListSiteTagTypes({
  tagTypes: { docs = [] } = {},
}: {
  tagTypes: { docs?: TagType[] }
}) {
  return (
    <Section
      title="Tag Types"
      action={
        <>
          <Link href="/admin/collections/tag-types/create">
          &oplus; Create New Tag Type
        </Link>
        </>
      }
    >
      {docs.length === 0 && (
        <div>
          <h3 className="text-bold">No tag types created.</h3>
          <p className="padding-y-2">
            You don&apos;t have any tag types available. Create your first tag type to
            start adding tags now! Think of tag types as a grouping category for your tags.{' '}
          </p>
          <p>
            <Link href="/admin/collections/tag-types/create">
              Create your first tag type now.
            </Link>
          </p>
          
          <p className="margin-top-1">
            <Link href={buildFilteredUrl(null, 'tags', 'tagTypes')}>
              View ungrouped tags
            </Link>
          </p>
          
        </div>
      )}
      {docs.length > 0 && (
        <div className="grid-row grid-gap-2">
          {docs.map((type) => {
            const filteredUrl = buildFilteredUrl(type.id, 'tags', 'tagTypes')
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
                    href={`/admin/collections/tag-types/${type.id}`}
                  >
                    Edit
                  </Link>
                }
              />
            )
          })}
          <CardLink
            href={buildFilteredUrl(null, 'tags', 'tagTypes')}
            title="Ungrouped Tags"
            description="View tags that have not been grouped by type"
            label="View ungrouped tags"
          />
        </div>
      )}
    </Section>
  )
}
