import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
  delete process.env.PREVIEW_ROOT
})

afterEach(() => {
  delete process.env.PREVIEW_ROOT
})

const mod = await import('./previews')
const collection = 'posts'

describe('getCollectionPreviewUrl', () => {
  it('fetches site slug and returns http URL without PREVIEW_ROOT', async () => {
    const getCollectionPreviewUrl = mod.getCollectionPreviewUrl

    const buildUrl = getCollectionPreviewUrl(collection)

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'preview.example.com' }),
      },
    } as any

    const data = {
      site: 'site-1',
      slug: 'my-article',
    }

    const url = await buildUrl({ data, req })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 'site-1',
    })
    expect(url).toBe('http://preview.example.com/posts/my-article')
  })

  it('fetches site slug and returns https URL with PREVIEW_ROOT', async () => {
    process.env.PREVIEW_ROOT = 'example.com'

    const getCollectionPreviewUrl = mod.getCollectionPreviewUrl

    const buildUrl = getCollectionPreviewUrl(collection)

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'mysite' }),
      },
    } as any

    const data = {
      site: 123, // numeric id also supported by findByID
      slug: 'my-post',
    }

    const url = await buildUrl({ data, req })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 123,
    })
    expect(url).toBe('https://mysite.example.com/posts/my-post')
  })

  it('coerces non-string slug values (defensive) and builds path', async () => {
    const getCollectionPreviewUrl = mod.getCollectionPreviewUrl

    const buildUrl = getCollectionPreviewUrl(collection)

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'host' }),
      },
    } as any

    // Even though admin adapter normalizes slug to a string,
    // this test ensures the utility tolerates stringifiable values.
    const data = {
      site: 's-1',
      slug: 42 as unknown as string,
    }

    const url = await buildUrl({ data, req })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 's-1',
    })
    // choosePreviewUrl uses template literals → String(value) is applied
    expect(url).toBe('http://host/posts/42')
  })
})

describe('getPagePreviewUrl', () => {
  it('returns http URL using page slug without collection prefix', async () => {
    const getPagePreviewUrl = mod.getPagePreviewUrl

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'site-a' }),
      },
    } as any

    const data = {
      site: 'site-77',
      slug: 'landing',
    }

    const url = await getPagePreviewUrl({ data, req })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 'site-77',
    })
    expect(url).toBe('http://site-a/landing')
  })

  it('returns https URL with PREVIEW_ROOT', async () => {
    process.env.PREVIEW_ROOT = 'root.dev'

    const getPagePreviewUrl = mod.getPagePreviewUrl

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'sub' }),
      },
    } as any

    const data = {
      site: '1',
      slug: 'home',
    }

    const url = await getPagePreviewUrl({ data, req })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: '1',
    })
    expect(url).toBe('https://sub.root.dev/home')
  })

  it('handles empty slug producing trailing slash only after host', async () => {
    const getPagePreviewUrl = mod.getPagePreviewUrl

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'mysite' }),
      },
    } as any

    const data = {
      site: 'abc',
      slug: '',
    }

    const url = await getPagePreviewUrl({ data, req })

    expect(url).toBe('http://mysite/')
  })
})

describe('getGlobalPreviewUrl', () => {
  it('builds base http URL for selected site', async () => {
    const getGlobalPreviewUrl = mod.getGlobalPreviewUrl

    const req = {
      user: { selectedSiteId: 'site-x' },
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'alpha' }),
      },
    } as any

    const url = await getGlobalPreviewUrl({ req })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 'site-x',
    })
    expect(url).toBe('http://alpha/')
  })

  it('builds base https URL with PREVIEW_ROOT', async () => {
    process.env.PREVIEW_ROOT = 'example.net'

    const getGlobalPreviewUrl = mod.getGlobalPreviewUrl

    const req = {
      user: { selectedSiteId: 999 },
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'beta' }),
      },
    } as any

    const url = await getGlobalPreviewUrl({ req })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 999,
    })
    expect(url).toBe('https://beta.example.net/')
  })
})

describe('getAdminCollectionPreview', () => {
  it('normalizes site (object.id) and slug (locale-aware) and returns URL', async () => {
    const preview = mod.getAdminCollectionPreview('posts')

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'preview.example.com' }),
      },
    } as any

    const doc = {
      site: { id: 'site-1', name: 'My Site' },               // object form
      slug: { fr: 'mon-article', en: 'my-article' },         // localized object
    }

    const url = await preview(doc, {
      req,
      locale: 'fr' as any,        
      token: undefined as any,    
    })

    // Assert normalization reached the utility via findByID
    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 'site-1', // normalized ID
    })

    // PREVIEW_ROOT not set → http://{slug}/{path}
    expect(url).toBe('http://preview.example.com/posts/mon-article')
  })

  it('normalizes site (array, uses first) and plain slug; respects PREVIEW_ROOT', async () => {
    process.env.PREVIEW_ROOT = 'example.com'
    const preview = mod.getAdminCollectionPreview('posts')

    const req = {
      payload: {
        findByID: vi.fn().mockResolvedValue({ slug: 'mysite' }),
      },
    } as any

    const doc = {
      site: [{ id: 'site-3' }, { id: 'site-4' }], // hasMany: take first
      slug: 'my-post',
    }

    const url = await preview(doc, {
      req,
      locale: undefined as any,
      token: undefined as any,
    })

    expect(req.payload.findByID).toHaveBeenCalledWith({
      collection: 'sites',
      id: 'site-3',
    })
    // PREVIEW_ROOT set → https://{subdomain}.{root}/{path}
    expect(url).toBe('https://mysite.example.com/posts/my-post')
  })
})
