import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Table from '@/components/ui/table'
import { QueryPagination } from '@/components/QueryPagination'
import { getReviewQueueItems } from '@/components/utilities'
import type { ReviewQueue as ReviewQueueDoc } from '@/payload-types'

const DEFAULT_LIMIT = 10

function parsePositiveInt(value: unknown, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed < 1) return fallback
  return parsed
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function ReadyForReview(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props
  const { req, permissions, locale, visibleEntities } = initPageResult

  const page = parsePositiveInt(searchParams?.page, 1)
  const limit = parsePositiveInt(searchParams?.limit, DEFAULT_LIMIT)

  const result = await getReviewQueueItems(req.payload, req.headers, { page, limit }).catch(() =>
    redirect(`/admin/login`),
  )

  const {
    docs = [],
    totalDocs = 0,
    totalPages = 1,
    page: currentPage = page,
    limit: currentLimit = limit,
    hasNextPage,
    hasPrevPage,
  } = result

  const rows = (docs as ReviewQueueDoc[]).map((item) => [
    {
      column: 'Title',
      value: (
        <Link href={item.editUrl} prefetch={false}>
          {item.title}
        </Link>
      ),
    },
    { column: 'Type', value: item.contentType },
    { column: 'Last Modified', value: formatDate(item.lastModified) },
  ])

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <main id="main-content" className="review-queue">
          <div className="flex-column margin-bottom-4">
            <h1>Ready for Review</h1>
            <p className="margin-top-2">
              Content across your site that has been marked &ldquo;Ready for Review.&rdquo;
              Select a title to review and publish the item. Published items are removed from
              this list.
            </p>
          </div>

          {rows.length === 0 ? (
            <p className="text-bold">
              There is no content ready for review right now.
            </p>
          ) : (
            <>
              <Table columns={['Title', 'Type', 'Last Modified']} rows={rows} />
              <QueryPagination
                page={currentPage}
                totalPages={totalPages}
                limit={currentLimit}
                totalDocs={totalDocs}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
              />
            </>
          )}
        </main>
      </Gutter>
    </DefaultTemplate>
  )
}
