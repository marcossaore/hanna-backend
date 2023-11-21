import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecretsService } from './secrets-service';
import { SecretsManagerCloud } from '../Cloud/secrets-manager.cloud';

@Module({
    providers: [
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
        },
    ],
    exports: [SecretsService]
})

export class SecretsModule {}
