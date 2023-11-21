import { join } from 'path';
import { DataSource } from 'typeorm';

export const load = ({ user, password, db, host, port, type, connectTimeout = 0 }: {user: string, password: string, db: string, host: string, port: number, type: any, connectTimeout: number}): DataSource => {
    try {
        return new DataSource({
            migrationsTransactionMode: 'all',
            type,
            host: host,
            port: port,
            username: user,
            password: password,
            database: db,
            entities: [join(__dirname, './**/*.entity{.ts,.js}')],
            connectTimeout: connectTimeout ?  connectTimeout * 60000 : 10000
        });
    } catch (error) {
        return null
    }
}