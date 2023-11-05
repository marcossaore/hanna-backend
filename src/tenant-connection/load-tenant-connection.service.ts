import { load as loadDataSource } from "../../db/companies/load-data-source";
import { SecretsService } from "../_common/services/Secret/secrets-service";
import { Connection } from "typeorm";

export class LoadTenantConnectionService {
    constructor(
        private readonly dbConfig: {host: string, port: number},
        private readonly secretesService: SecretsService,
    ) {}
    async load (tenantName: string): Promise<Connection> {
        try {
            const credentials = JSON.parse(await this.secretesService.get(tenantName));

            console.log('credentials ', credentials)
            
            const datasource = loadDataSource({
                host: this.dbConfig.host,
                port: this.dbConfig.port,
                user: credentials.dbUser,
                password: credentials.dbPass,
                db: tenantName
            });
    
            return Promise.resolve(datasource.isConnected? datasource : datasource.connect());
        } catch (error) {
            return null;
        }
       
    }
 }
