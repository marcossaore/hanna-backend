import { SecretsManagerCloud } from "../../../../services/Cloud/secrets-manager.cloud";
import { SecretsService } from "../../../../services/Secret/secrets-service";

export const secretsServiceFactory = ({ key, secret, region, version, endpoint  }: {key: string, secret: string, region: string, version: string, endpoint: string }): SecretsService => {
    const secretsManagerCloud = new SecretsManagerCloud({
        key,
        secret,
        region,
        version,
        endpoint
    });
    return new SecretsService(secretsManagerCloud);
}