import { vi } from 'vitest'

export function createFetchResponse(data: unknown, ok = true) {
  return Promise.resolve({
    ok,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
  } as Response)
}

export function getHeader(
  headers: HeadersInit | undefined,
  key: string,
): string | undefined {
  if (!headers) return undefined

  if (headers instanceof Headers) {
    return headers.get(key) ?? undefined
  }

  if (Array.isArray(headers)) {
    const found = headers.find(([k]) => k.toLowerCase() === key.toLowerCase())
    return found?.[1]
  }

  const record = headers as Record<string, string>
  const foundKey = Object.keys(record).find(
    (k) => k.toLowerCase() === key.toLowerCase(),
  )
  return foundKey ? record[foundKey] : undefined
}

export function mockRelationshipFieldSearchFetch() {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? 'GET'
    const override = getHeader(
      init?.headers as HeadersInit | undefined,
      'X-Payload-HTTP-Method-Override',
    )

    if (method === 'POST' && override === 'GET' && url === '/api/tags') {
      const parsedBody =
        typeof init?.body === 'string' ? JSON.parse(init.body) : {}

      const andClauses = Array.isArray(parsedBody?.where?.and)
        ? parsedBody.where.and
        : []

      const likeClause = andClauses.find(
        (clause: any) => clause?.title?.like != null
      )

      const raw = likeClause?.title?.like
      const normalized =
        typeof raw === 'string' ? raw.toLowerCase().replace(/%/g, '') : ''

      if (normalized.includes('re')) {
        return createFetchResponse({
          docs: [
            { id: 11, title: 'React' },
            { id: 12, title: 'React Testing Library' },
          ],
        })
      }

      return createFetchResponse({ docs: [] })
    }

    return createFetchResponse({ docs: [] })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function mockRelationshipFieldEditFetch() {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? 'GET'
    const override = getHeader(
      init?.headers as HeadersInit | undefined,
      'X-Payload-HTTP-Method-Override',
    )

    // PATCH save
    if (method === 'PATCH' && url === '/api/tags/2') {
      return createFetchResponse({
        id: 2,
        title: 'Alpha Updated',
        description: '',
      })
    }

    // RelationshipField read requests use POST + X-Payload-HTTP-Method-Override: GET
    if (method === 'POST' && override === 'GET' && url === '/api/tags') {
      const parsedBody =
        typeof init?.body === 'string' ? JSON.parse(init.body) : {}

      // selected chip hydration
      if (parsedBody?.where?.id?.in) {
        return createFetchResponse({
          docs: [{ id: 2, title: 'Alpha', description: '' }],
        })
      }

      // edit modal hydration
      if (parsedBody?.where?.id?.equals === 2) {
        return createFetchResponse({
          docs: [{ id: 2, title: 'Alpha', description: '' }],
        })
      }

      // default options / menu loads
      return createFetchResponse({ docs: [] })
    }

    // Fallback so fetch never returns undefined
    return createFetchResponse({ docs: [] })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function mockRelationshipFieldCreateFetch() {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? 'GET'
    const override = getHeader(
      init?.headers as HeadersInit | undefined,
      'X-Payload-HTTP-Method-Override',
    )

    // Create POST
    if (method === 'POST' && override !== 'GET' && url === '/api/tags') {
      return createFetchResponse({
        id: 50,
        title: 'New Tag',
        description: 'A new description',
      })
    }

    // RelationshipField read requests use POST + override GET
    if (method === 'POST' && override === 'GET' && url === '/api/tags') {
      return createFetchResponse({ docs: [] })
    }

    // Fallback so fetch never returns undefined
    return createFetchResponse({ docs: [] })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
