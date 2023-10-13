import { SecretsManagerClient, GetSecretValueCommand, CreateSecretCommand } from '@aws-sdk/client-secrets-manager';

type ServiceConfig = {
    region: string,
    key: string,
    version: string,
    secret: string,
    endpoint: string|null
}

export class SecretsManagerCloud {

    private service: SecretsManagerClient = null;

    constructor(private readonly serviceConfig: ServiceConfig) {
        
        const secretsManager = new SecretsManagerClient({
            region: serviceConfig.region,
            apiVersion: serviceConfig.version,
            credentials: {
                accessKeyId: serviceConfig.key,
                secretAccessKey: serviceConfig.secret
            },
            endpoint: serviceConfig.endpoint
        });

        this.service = secretsManager;
    }

    async save (key: string, data: string) {
        const createSecretCommand = new CreateSecretCommand({
            Name: key,
            SecretString: data
        });
       
        this.service.send(createSecretCommand);
    }

    async get (key: string) {
        return new Promise((resolve) => {
            const getSecret = new GetSecretValueCommand({ SecretId: key });
            this.service.send(getSecret)
            .then((data) => {
                return resolve(data.SecretString)
            }).catch((e) => {
                return resolve(null)
            })
        });
    }
}