import { DbManagerProtocol } from "./protocols/db-manager.protocol";

export class MySqlDbManagerService implements DbManagerProtocol {
    async createConnection ({ host, user, password, port }: { host: string, user: string, password: string, port: number }): Promise<DbManagerProtocol> {
        return this;
    }
    
    async query (statement: string, data?: any): Promise<any> {

    }

    async end (): Promise<any> {
        
    }
}