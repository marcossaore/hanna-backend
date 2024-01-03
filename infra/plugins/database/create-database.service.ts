import { Injectable } from "@nestjs/common";
import { MySqlDbManagerService } from "./repository/mysql-db-manager";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CreateDatabaseService {

    private dbConfig: { host: string, port: number, user: string, password: string };

    constructor(
        private readonly configService: ConfigService,
        private readonly dbManagerService: MySqlDbManagerService
    ) {
        this.dbConfig = this.configService.get('database');
    }

    async create (db: string): Promise<void> {
        const connection = await this.dbManagerService.createConnection({
            host: this.dbConfig.host,
            user: this.dbConfig.user,
            password: this.dbConfig.password,
            port: this.dbConfig.port
        });
        
        try {
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db}\``);
      
            // await connection.query(
            //   `CREATE USER IF NOT EXISTS ?@'%' IDENTIFIED BY ?`,
            //   [credentials.dbUser, credentials.dbPass]
            // );
      
            // await connection.query(
            //   `GRANT SELECT, INSERT, UPDATE, DELETE ON \`${credentials.db}\`.* TO ?@'%'`,
            //   [credentials.dbUser]
            // );
      
            await connection.query('FLUSH PRIVILEGES');
        } catch(error) {
            try {
                await connection.query(`DROP DATABASE IF EXISTS \`${db}\``);
            } catch (dbError) { }

            try {
                // await connection.query(`DROP USER IF EXISTS ?@'%'`, [credentials.dbUser]);
            } catch (userError) {}

            throw error;
        } finally {
            await connection.end();
          }
    } 
}