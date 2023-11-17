import { Injectable } from "@nestjs/common";
import { createConnection } from "typeorm";
import companiesMigrations from "@db/companies/companies.migrations";

@Injectable()
export class MigrationsCompanyService {
    constructor (private readonly dbConfig: { host: string, port: number, user: string, password: string }) {}

    async run (databaseName: string) {
        const connection = await createConnection({
            migrationsTransactionMode: 'all',
            type: 'mysql',
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            username: this.dbConfig.user,
            password: this.dbConfig.password,
            database: databaseName,
            synchronize: false,
            migrations: companiesMigrations,
            migrationsRun: true
        });

        try {
            await connection.runMigrations();
        } catch (error) {
            throw error;
        } finally {
            await connection.close();
        }
    }
}