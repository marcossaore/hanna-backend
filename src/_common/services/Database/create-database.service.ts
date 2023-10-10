import { Inject, Injectable } from "@nestjs/common";
import { MySqlDbManagerService } from "./repository/mysql-db-manager";
@Injectable()
export class CreateDatabaseService {

    constructor(
        @Inject('HOST_DB_CONFIG') private readonly hostDbConfig,
        private readonly dbManagerService: MySqlDbManagerService
    ) {}

    async create (credentials: {db: string, dbUser: string, dbPass: string}): Promise<void> {
        const connection = await this.dbManagerService.createConnection({
            host: this.hostDbConfig.host,
            user: this.hostDbConfig.user,
            password: this.hostDbConfig.password,
            port: this.hostDbConfig.port
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