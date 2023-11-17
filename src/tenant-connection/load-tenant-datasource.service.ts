import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { load as loadDataSource } from "@db/companies/load-data-source";

@Injectable()
export class LoadTenantDataSourceService {
    private datasource: Connection;
    async load (options: {user: string, password: string, db: string, host: string, port: number}): Promise<Connection> {
        try {
            this.datasource = loadDataSource({
                host: options.host,
                port: options.port,
                user: options.user,
                password: options.password,
                db: options.db
            });
            return Promise.resolve(this.datasource.isConnected? this.datasource : this.datasource.connect());
        } catch (error) {
            return null;
        }
    }
 }
