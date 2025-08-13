import {
  S3ClientConfig,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
  _Object,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3'

interface SyncResults {
  copied: string[]
  updated: string[]
  deleted: string[]
}

class S3BucketSync {
  private credentials: S3ClientConfig
  private srcBucket: string
  private destBucket: string
  private s3Client: S3Client

  constructor(credentials: S3ClientConfig, srcBucket: string, destBucket: string) {
    this.credentials = credentials
    this.srcBucket = srcBucket
    this.destBucket = destBucket
    this.s3Client = new S3Client(credentials)
  }

  async sync(srcPrefix: string, destPrefix: string): Promise<SyncResults> {
    try {
      const results: SyncResults = {
        copied: [],
        updated: [],
        deleted: [],
      }

      const [srcObjects, destObjects] = await Promise.all([
        this.listAllObjects(this.srcBucket, srcPrefix),
        this.listAllObjects(this.destBucket, destPrefix),
      ])

      const srcMap = new Map<string, _Object>()
      srcObjects.forEach((obj) => {
        const relPath = obj.Key?.startsWith(srcPrefix)
          ? obj.Key.substring(srcPrefix.length)
          : obj.Key || ''
        srcMap.set(relPath, obj)
      })

      const destMap = new Map<string, _Object>()
      destObjects.forEach((obj) => {
        const relPath = obj.Key?.startsWith(destPrefix)
          ? obj.Key.substring(destPrefix.length)
          : obj.Key || ''
        destMap.set(relPath, obj)
      })

      for (const [relPath, srcObj] of srcMap) {
        const destKey = destPrefix + relPath
        const destObj = destMap.get(relPath)

        if (!destObj) {
          await this.copyObject(this.srcBucket, srcObj.Key!, this.destBucket, destKey)
          results.copied.push(destKey)
        } else if (this.shouldUpdate(srcObj, destObj)) {
          await this.copyObject(this.srcBucket, srcObj.Key!, this.destBucket, destKey)
          results.updated.push(destKey)
        }
      }

      for (const [relPath, destObj] of destMap) {
        if (!srcMap.has(relPath)) {
          await this.deleteObject(this.destBucket, destObj.Key!)
          results.deleted.push(destObj.Key!)
        }
      }

      return results
    } catch (error) {
      throw new Error(`Sync failed: ${error.message}`)
    }
  }

  private async listAllObjects(bucket: string, prefix: string): Promise<_Object[]> {
    const objects: _Object[] = []
    let continuationToken: string | undefined

    do {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })

      const response: ListObjectsV2CommandOutput = await this.s3Client.send(command)

      if (response.Contents) {
        objects.push(...response.Contents)
      }

      continuationToken = response.NextContinuationToken
    } while (continuationToken)

    return objects
  }

  private shouldUpdate(srcObj: _Object, destObj: _Object): boolean {
    return (
      (srcObj.LastModified && destObj.LastModified && srcObj.LastModified > destObj.LastModified) ||
      srcObj.ETag !== destObj.ETag
    )
  }

  private async copyObject(srcBucket: string, srcKey: string, destBucket: string, destKey: string) {
    const command = new CopyObjectCommand({
      CopySource: `${srcBucket}/${srcKey}`,
      Bucket: destBucket,
      Key: destKey,
    })

    await this.s3Client.send(command)
  }

  private async deleteObject(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key })

    await this.s3Client.send(command)
  }
}

export default S3BucketSync
