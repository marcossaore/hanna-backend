import { REQUEST } from "@nestjs/core";
import { Provider, Scope, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { load } from "../../db/companies/load-data-source";
import { ConfigService } from "@nestjs/config";
import { SecretsService } from "../_common/services/Secret/secrets-service";
import { SecretsManagerCloud } from "../_common/services/Cloud/secrets-manager.cloud";

const getSecretService = (configService: ConfigService): SecretsService => {
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

export const TenantProvider: Provider = {
    provide: 'CONNECTION',
    scope: Scope.REQUEST,
    useFactory: async (request: Request, configService: ConfigService) => {
        try {
            const tenantName = 'buxapp' // request?.tenant?.identifier;
            if (!tenantName) {
                throw null;
            }
            const secretService = getSecretService(configService);
            const credentials = JSON.parse(await secretService.get(tenantName));

            console.log('credentials ', credentials)
            const datasource = load({
                host: configService.get('database').host,
                port: configService.get('database').port,
                user: credentials.dbUser,
                password: credentials.dbPass,
                db: tenantName
            });
            return Promise.resolve(datasource.isConnected? datasource : datasource.connect());
        } catch (error) {
            throw new UnauthorizedException()
        }
    },
    inject: [REQUEST, ConfigService]
}