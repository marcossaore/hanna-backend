import { Connection, createConnection } from "typeorm";
import configuration from "@/shared/config/configuration";

export const getAllDatabases = async (): Promise<Connection> => {
    const { host, password, port, type, user } = configuration().database;
    const connection = await createConnection({
        migrationsTransactionMode: 'all',
        type,
        host,
        port,
        username: user,
        password
    });
    return connection
}