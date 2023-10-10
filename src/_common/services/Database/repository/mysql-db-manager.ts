import * as mysql from 'mysql2/promise';
import { DbManagerProtocol } from "./protocols/db-manager.protocol";

export class MySqlDbManagerService implements DbManagerProtocol {
    connection: any;

    async createConnection ({ host, user, password, port }: { host: string, user: string, password: string, port: number }): Promise<DbManagerProtocol> {
        this.connection =  await mysql.createConnection({
            host,
            user,
            password,
            port
        });
        return this;
    }
    
    async query (statement: string, data?: any): Promise<any> {
        if (this.connection) {
            return this.connection.query(statement, data);
        }
    }

    async end (): Promise<any> {
        if (this.connection) {
            return this.connection.end()
        }
    }
}