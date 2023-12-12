import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand
} from '@aws-sdk/client-secrets-manager'

type ServiceConfig = {
  region: string
  key: string
  version: string
  secret: string
  endpoint: string | null
}

export class SecretsManagerCloud {
  private service: SecretsManagerClient = null

  constructor(private readonly serviceConfig: ServiceConfig) {
    this.service = new SecretsManagerClient({
      region: this.serviceConfig.region,
      apiVersion: this.serviceConfig.version,
      credentials: {
        accessKeyId: this.serviceConfig.key,
        secretAccessKey: this.serviceConfig.secret
      },
      endpoint: this.serviceConfig.endpoint
    })
  }

  async save(key: string, data: string) {
    const createSecretCommand = new CreateSecretCommand({
      Name: key,
      SecretString: data
    })

    this.service.send(createSecretCommand)
  }

  async get(key: string) {
    return new Promise((resolve) => {
      const getSecret = new GetSecretValueCommand({ SecretId: key })
      this.service
        .send(getSecret)
        .then((data) => {
          return resolve(data.SecretString)
        })
        .catch(() => {
          return resolve(null)
        })
    })
  }
}
