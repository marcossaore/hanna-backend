import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { LoadTenantDataSourceService } from "./load-tenant-datasource.service";
import { SecretsService } from "@/_common/services/Secret/secrets-service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LoadTenantConnectionService {
    private dbConfig: { host: string, port: number };

    constructor(
        private readonly configService: ConfigService,
        private readonly secretesService: SecretsService,
        private readonly loadTenantDatasourceService: LoadTenantDataSourceService
    ) {
        this.dbConfig = this.configService.get('database');
    }
    async load (tenantName: string, timeoutInMinutes: number = 0): Promise<Connection> {
        try {
            const credentials = JSON.parse(await this.secretesService.get(tenantName));
            const datasource = this.loadTenantDatasourceService.load({
                host: this.dbConfig.host,
                port: this.dbConfig.port,
                user: credentials.dbUser,
                password: credentials.dbPass,
                db: tenantName,
                connectTimeout: timeoutInMinutes
            });
            return datasource;
        } catch (error) {
            return null;
        }
    }
 }
