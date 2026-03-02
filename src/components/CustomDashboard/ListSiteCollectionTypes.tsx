'use client'

import React, { useEffect, useState } from 'react'
import { CollectionType } from '@/payload-types'
import Link from 'next/link'

const buildFilteredUrl = (collectionTypeId: string | number) => {
  const params = new URLSearchParams({
    limit: '10',
    page: '1',
  })

  // Add the where filter with the proper structure
  params.append('where[or][0][and][0][collectionType][equals]', String(collectionTypeId))

  return `/admin/collections/collection-entries?${params.toString()}`
}

export default function ListSiteCollectionTypes({
  collectionTypes: { docs = [] } = {},
}: {
  collectionTypes: { docs?: CollectionType[] }
}) {
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>(docs)
  const [loading, setLoading] = useState(docs.length === 0)

  useEffect(() => {
    // Fetch unique collection types
    const fetchCollectionTypes = async () => {
      try {
        // const response = await fetch('/api/collection-types?distinct=type')
        // const data = await response.json()
        // setCollectionTypes(data.docs || docs)
      } catch (error) {
        console.error('Error fetching collection types:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionTypes()
  }, [])

  return (
    <div className="margin-bottom-4">
      <h2 className="margin-bottom-2">Collection Entities by Type</h2>
      {loading && (
        <div className="padding-y-4">
          <div>Loading collection types...</div>{' '}
        </div>
      )}
      {!loading && collectionTypes.length === 0 && (
        <div className="padding-y-4 margin-left-2">
          <h3 className="text-bold">No Collection Types Available</h3>
          <p className="padding-y-2">
            Create your first collection type to start adding content now! Think of collection types
            as newspost, reports, events, and anything else to fit your needs.
          </p>
        </div>
      )}
      {!loading && collectionTypes.length > 0 && (
        <div className="grid-row grid-gap-2">
          {collectionTypes.map((type) => {
            const filteredUrl = buildFilteredUrl(type.id)
            return (
              <div key={type.id} className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
                <Link href={filteredUrl} className="usa-card__link">
                  <div className="usa-card">
                    <div className="usa-card__container">
                      <div className="usa-card__header">
                        <div className="display-flex flex-justify-between flex-align-center">
                          <h3 className="usa-card__heading margin-0">{type.title}</h3>
                          <span className="dashboard-card-icon" aria-hidden="true">
                            +
                          </span>
                        </div>
                      </div>
                      <div className="usa-card__body">
                        <span className="usa-sr-only">Description: </span>
                        <p>{type.description ? type.description : 'No description available.'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
