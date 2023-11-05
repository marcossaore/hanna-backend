import { join } from 'path';
import { DataSource } from 'typeorm';

export const load = ({ user, password, db, host, port}: {user: string, password: string, db: string, host: string, port: number}): DataSource => {
    try {        
        return new DataSource({
            migrationsTransactionMode: 'all',
            type: 'mysql',
            host: host,
            port: port,
            username: user,
            password: password,
            database: db,
            entities: [join(__dirname, './**/*.entity{.ts,.js}')]
        });
    } catch (error) {
        return null
    }
}