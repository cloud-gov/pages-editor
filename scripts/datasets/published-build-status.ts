const publishedBuildStatus = (siteId: number) => [
  {
    pagesBuildId: 1,
    completedAt: new Date().toISOString(),
    state: 'success',
    site: siteId,
    startedAt: new Date().toISOString(),
    error:null,
  },
  {
    pagesBuildId: 2,
    completedAt: new Date().toISOString(),
    state: 'error',
    site: siteId,
    startedAt: new Date().toISOString(),
    error:'There was a problem running Jekyll, see the above logs for details.',
  },
  
]

export default publishedBuildStatus
