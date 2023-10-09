import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MySqlDbManagerService } from "./repository/mysql-db-manager";

@Injectable()
export class CreateDatabaseService {

    constructor(
        private readonly configService: ConfigService,
        private readonly dbManagerService: MySqlDbManagerService
    ) {}

    async create (credentials: {db: string, dbUser: string, dbPass: string}): Promise<void> {
        const host = this.configService.get<string>('database.host');
        const user = this.configService.get<string>('database.user');
        const password = this.configService.get<string>('database.password');
        const port = this.configService.get<number>('database.port');

        const connection = await this.dbManagerService.createConnection({
            host,
            user,
            password,
            port,
        });

        try {
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${credentials.db}\``);
      
            await connection.query(
              `CREATE USER IF NOT EXISTS ?@'%' IDENTIFIED BY ?`,
              [credentials.dbUser, credentials.dbPass]
            );
      
            await connection.query(
              `GRANT SELECT, INSERT, UPDATE, DELETE ON \`${credentials.db}\`.* TO ?@'%'`,
              [credentials.dbUser]
            );
      
            await connection.query('FLUSH PRIVILEGES');
        } catch(error) {
            try {
                await connection.query(`DROP DATABASE IF EXISTS \`${credentials.db}\``);
            } catch (dbError) { }

            try {
                await connection.query(`DROP USER IF EXISTS ?@'%'`, [credentials.dbUser]);
            } catch (userError) {}

            throw error;
        } finally {
            await connection.end();
          }
    } 
}