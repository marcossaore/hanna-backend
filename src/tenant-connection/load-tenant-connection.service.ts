import { Inject, Injectable } from "@nestjs/common";
import { SecretsService } from "../_common/services/Secret/secrets-service";
import { LoadTenantDataSourceService } from "./load-tenant-datasource.service";
import { Connection } from "typeorm";

@Injectable()
export class LoadTenantConnectionService {
    constructor(
        @Inject('DB_CONFIG') private readonly dbConfig: {host: string, port: number},
        private readonly secretesService: SecretsService,
        private readonly loadTenantDatasourceService: LoadTenantDataSourceService
    ) {}
    async load (tenantName: string): Promise<Connection> {
        try {
            const credentials = JSON.parse(await this.secretesService.get(tenantName));
            const datasource = this.loadTenantDatasourceService.load({
                host: this.dbConfig.host,
                port: this.dbConfig.port,
                user: credentials.dbUser,
                password: credentials.dbPass,
                db: tenantName
            })
            return datasource;
        } catch (error) {
            return null;
        }
    }
 }
