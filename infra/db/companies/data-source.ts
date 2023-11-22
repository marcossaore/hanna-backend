require('dotenv').config();
import { join } from 'path';
import { DataSource } from 'typeorm';
import env from '../../../src/shared/config/configuration';

const { database } = env();

const AppDataSource =  new DataSource({
    migrationsTransactionMode: 'all',
    type: database.type,
    host: database.host,
    port: database.port,
    username: database.user,
    password: database.password,
    database: 'company_model',
    entities: [join(__dirname, './**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, './migrations/*{.ts,.js}')],
});

export default AppDataSource;