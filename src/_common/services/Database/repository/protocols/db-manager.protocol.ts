export interface DbManagerProtocol {
    createConnection ({ host, user, password, port }: { host: string, user: string, password: string, port: number }): Promise<DbManagerProtocol>
    query (statement: string, data?: any): Promise<any>
    end (): Promise<any>
}