import { Injectable } from "@nestjs/common";
import { join } from "path";
import { Connection, createConnection } from "typeorm";

@Injectable()
export class SeedRunnerService implements SeedProtocol<string> {
    private connection: Connection;

    constructor (
        private readonly dbConfig: { host: string, port: number, user: string, password: string },
        private readonly seeders: SeedProtocol<Connection>[]
    ) {}

    async seed(database: string): Promise<void> {
        this.connection = await createConnection({
            migrationsTransactionMode: 'all',
            type: 'mysql',
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            username: this.dbConfig.user,
            password: this.dbConfig.password,
            database: database,
            entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
            connectTimeout: 60000 * 5
        });

        try {
            for await (const seeder of this.seeders) {
                await seeder.seed(this.connection);
            }
        } catch (error) {
            throw error;
        } finally {
            await this.connection.close();
        }

  }
}