import * as qs from 'qs-esm'

export async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchRelationshipDocs(
  url: string,
  queryBody: any,
  signal: AbortSignal,
) {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    signal,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Payload-HTTP-Method-Override': 'GET',
    },
    body: qs.stringify(queryBody),
  })

  const data = await res.json()
  return Array.isArray(data?.docs) ? data.docs : []
}

export async function saveRelationshipDoc(args: {
  url: string
  editingId?: string | number
  payload: Record<string, unknown>
  signal: AbortSignal
}) {
  const { url, editingId, payload, signal } = args

  const res = await fetch(editingId != null ? `${url}/${editingId}` : url, {
    method: editingId != null ? 'PATCH' : 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  return safeJson(res)
}
