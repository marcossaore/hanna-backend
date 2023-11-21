import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Connection, createConnection } from "typeorm";
import { join } from "path";

@Injectable()
export class SeedRunnerService implements SeedProtocol<string> {
    private connection: Connection;
    private dbConfig: { host: string, port: number, user: string, password: string };

    constructor (
        private readonly configService: ConfigService,
        private readonly seeders: SeedProtocol<Connection>[],
        private readonly timeout: number = 5
    ) {
        this.dbConfig = this.configService.get('database');
    }

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
            connectTimeout: 60000 * this.timeout
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