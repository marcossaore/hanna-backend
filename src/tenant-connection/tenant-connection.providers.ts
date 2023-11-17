import { Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from "@nestjs/core";
import { ConfigService } from '@nestjs/config';
import { Request } from "express";
import { LoadTenantConnectionService } from './load-tenant-connection.service';
import { LoadTenantDataSourceService } from './load-tenant-datasource.service';
import { secretsServiceFactory } from '@/_common/helpers/factories/_common/services/secrets-service-factory';

export const LoadTenantConnectionProvider = {
    provide: LoadTenantConnectionService,
    inject: [ConfigService],
    useFactory (configService: ConfigService) {
        const dbConfig = configService.get('database');
        const { key, secret, region, version, endpoint } = configService.get('aws');
        const factory = secretsServiceFactory({key, secret, region, version, endpoint});
        const loadTenantDataSourceService = new LoadTenantDataSourceService();
        return new LoadTenantConnectionService(dbConfig, factory, loadTenantDataSourceService);
    }
}

export const GetAndLoadTenantConnectionInSessionProvider = {
    provide: 'CONNECTION',
    scope: Scope.REQUEST,
    useFactory: async (request: Request, loadTenantConnectionService: LoadTenantConnectionService) => {
        const tenantName =  request?.session?.auth?.tenant?.identifier;
        if (!tenantName) {
            throw new UnauthorizedException()
        }
        try {
            return await loadTenantConnectionService.load(tenantName)
        } catch (error) {
            throw new UnauthorizedException()
        }
    },
    inject: [REQUEST, LoadTenantConnectionService]
}