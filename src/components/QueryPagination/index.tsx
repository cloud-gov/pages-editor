'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Pagination, PerPage } from '@payloadcms/ui'
import { PageRange } from '@/components/PageRange'

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export const QueryPagination: React.FC<{
  page: number
  totalPages: number
  limit: number
  totalDocs: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}> = ({ page, totalPages, limit, totalDocs, hasNextPage, hasPrevPage }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const buildUrl = (overrides: { page?: number; limit?: number }) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(overrides.page ?? page))
    params.set('limit', String(overrides.limit ?? limit))
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="page-controls">
      <Pagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        nextPage={page + 1}
        prevPage={page - 1}
        onChange={(nextPage) => router.push(buildUrl({ page: nextPage }))}
      />
      <div className="page-controls__page-info">
        <PageRange
          collectionLabels={{ singular: 'item', plural: 'items' }}
          currentPage={page}
          limit={limit}
          totalDocs={totalDocs}
        />
      </div>
      <PerPage
        limit={limit}
        limits={PER_PAGE_OPTIONS}
        handleChange={(nextLimit) => router.push(buildUrl({ page: 1, limit: nextLimit }))}
      />
    </div>
  )
}
