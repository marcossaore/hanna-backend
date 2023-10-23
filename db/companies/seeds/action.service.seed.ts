import { Injectable } from "@nestjs/common";
import { createConnection  } from "typeorm";
import { ActionModule } from "../entities/module/action-module.entity";
import { join } from "path";

@Injectable()
export class ActionServiceSeed {
    constructor (private readonly dbConfig: { host: string, port: number, user: string, password: string }) {}

    async seed(databaseName: string) {

        const connection = await createConnection({
            migrationsTransactionMode: 'all',
            type: 'mysql',
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            username: this.dbConfig.user,
            password: this.dbConfig.password,
            database: databaseName,
            entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
        });

        try {
            const actionRepository =  connection.getRepository(ActionModule);
    
            const totalActions = await actionRepository.count();
    
            if (totalActions === 0) {
                await actionRepository.save([
                    {
                        name: 'read'
                    },
                    {
                        name: 'create'
                    },
                    {
                        name: 'edit'
                    },
                    {
                        name: 'delete'
                    }
                ]);
            }
            
        } catch (error) {
            throw error;
        } finally {
            await connection.close();
        }

  }
}