import configuration from '@/shared/config/configuration'
import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3'

export const createAppBucket = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const { key, secret, region, version, endpoint, bucket } =
      configuration().aws
    const s3Client = new S3Client({
      region,
      apiVersion: version,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret
      },
      endpoint,
      forcePathStyle: true
    })

    const createBucketCommand = new CreateBucketCommand({
      Bucket: bucket
    })

    s3Client
      .send(createBucketCommand)
      .then(() => {
        return resolve(true)
      })
      .catch(() => {
        return resolve(false)
      })
  })
}
