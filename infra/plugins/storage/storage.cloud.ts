import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

type ServiceConfig = {
  bucket: string
  region: string
  key: string
  version: string
  secret: string
  endpoint: string | null
}

export class StorageCloud {
  private storageClient: S3Client = null

  constructor(private readonly serviceConfig: ServiceConfig) {
    const options = {
      region: this.serviceConfig.region,
      apiVersion: this.serviceConfig.version,
      credentials: {
        accessKeyId: this.serviceConfig.key,
        secretAccessKey: this.serviceConfig.secret
      },
      endpoint: this.serviceConfig.endpoint
    }

    if (this.serviceConfig.endpoint) {
      options['forcePathStyle'] = true
    }

    this.storageClient = new S3Client(options)
  }

  async upload(buffer: Buffer, key: string): Promise<boolean> {
    return new Promise((resolve) => {
      const command = new PutObjectCommand({
        Bucket: this.serviceConfig.bucket,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg'
      })

      this.storageClient
        .send(command)
        .then(() => {
          return resolve(true)
        })
        .catch(() => {
          return resolve(false)
        })
    })
  }

  async getUrl(key: string) {
    return new Promise((resolve) => {
      const command = new GetObjectCommand({
        Bucket: this.serviceConfig.bucket,
        Key: key
      })

      const comandObjectHead = new HeadObjectCommand({
        Bucket: this.serviceConfig.bucket,
        Key: key
      })

      this.storageClient
        .send(comandObjectHead)
        .then(() => {
          return getSignedUrl(this.storageClient, command, {
            expiresIn: 15 * 60
          })
        })
        .then((data) => {
          return resolve(data)
        })
        .catch(() => {
          return resolve(null)
        })
    })
  }
}
