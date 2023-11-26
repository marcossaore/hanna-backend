import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecretsService } from '@/modules/infra/secrets/secrets-service';
import { LoadTenantDataSourceService } from './load-tenant-datasource.service';

@Injectable()
export class LoadTenantConnectionService {
    private dbConfig: { host: string; port: number; type: any };

    constructor(
        private readonly configService: ConfigService,
        private readonly secretesService: SecretsService,
        private readonly loadTenantDatasourceService: LoadTenantDataSourceService,
    ) {
        this.dbConfig = this.configService.get('database');
    }
    async load(
        tenantName: string,
        timeoutInMinutes: number = 0,
    ): Promise<Connection> {
        try {
            const credentials = JSON.parse(
                await this.secretesService.get(tenantName),
            );
            const datasource = this.loadTenantDatasourceService.load({
                host: this.dbConfig.host,
                port: this.dbConfig.port,
                user: credentials.dbUser,
                password: credentials.dbPass,
                db: tenantName,
                connectTimeout: timeoutInMinutes,
                type: this.dbConfig.type,
            });
            return datasource;
        } catch (error) {
            return null;
        }
    }
}
