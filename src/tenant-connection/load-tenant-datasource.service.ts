import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { load as loadDataSource } from "@infra/db/companies/load-data-source";

type LoadTenantDataSourceType = {
    user: string, 
    password: string,
    db: string,
    host: string,
    port: number,
    connectTimeout?: number
}

@Injectable()
export class LoadTenantDataSourceService {
    private datasource: Connection;
    async load ({ host, port, user, password, db, connectTimeout = 0 }: LoadTenantDataSourceType): Promise<Connection> {
        try {
            this.datasource = loadDataSource({
                host,
                port,
                user,
                password,
                db,
                connectTimeout
            });
            return Promise.resolve(this.datasource.isConnected? this.datasource : this.datasource.connect());
        } catch (error) {
            return null;
        }
    }
 }
