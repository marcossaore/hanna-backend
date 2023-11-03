import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenerateDbCredentialsService } from "../../_common/services/Database/generate-db-credentials.service";
import { SecretsManagerCloud } from "../../_common/services/Cloud/secrets-manager.cloud";
import { SecretsService } from "../../_common/services/Secret/secrets-service";
import { TenantCommand } from "./tenant.command";

@Module({
    providers: [
        TenantCommand,
        GenerateDbCredentialsService,
        {
            inject: [ConfigService],
            provide: SecretsService,
            useFactory (configService: ConfigService) {
                const { key, secret, region, version, endpoint } = configService.get('aws');
                const secretsManagerCloud = new SecretsManagerCloud({
                    key,
                    secret,
                    region,
                    version,
                    endpoint
                });
                return new SecretsService(secretsManagerCloud);
            }
        }
    ]
})
export class TenantCommandModule {}