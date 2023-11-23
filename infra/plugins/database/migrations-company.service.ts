import { Injectable } from "@nestjs/common";
import { createConnection } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

@Injectable()
export class MigrationsCompanyService {

    private readonly dbConfig: { host: string, port: number, user: string, password: string, type: any }

    constructor (private readonly configService: ConfigService) {
        this.dbConfig = this.configService.get('database');
    }

    async run (databaseName: string) {
        const connection = await createConnection({
            migrationsTransactionMode: 'all',
            type: this.dbConfig.type,
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            username: this.dbConfig.user,
            password: this.dbConfig.password,
            database: databaseName,
            synchronize: false,
            migrations: [join('dist/infra/db/companies/migrations/*{.ts,.js}')],
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