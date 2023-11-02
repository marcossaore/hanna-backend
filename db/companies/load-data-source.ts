require('dotenv').config();
import env from '../../src/_config/configuration';
import { join } from 'path';
import { DataSource } from 'typeorm';
const { environment } = env();

export const load = ({ host, port, user, password, db}): DataSource => {
    try {        
        return new DataSource({
            migrationsTransactionMode: 'all',
            type: 'mysql',
            host: host,
            port: port,
            username: user,
            password: password,
            database: db,
            entities: [join(__dirname, './**/*.entity{.ts,.js}')],
            migrations: [join(__dirname, './migrations/*{.ts,.js}')],
            synchronize: environment === 'dev' ? true : false
        });
    } catch (error) {
        return null
    }
}