import { Injectable } from "@nestjs/common";
import { createConnection  } from "typeorm";
import { join } from "path";
import { User } from "@db/companies/entities/user/user.entity";
import { Module } from "@db/companies/entities/module/module.entity";

@Injectable()
export class AddFirstUserAsAdminService {
    constructor (private readonly dbConfig: { host: string, port: number, user: string, password: string }) {}

    async add(databaseName: string, user: any) {

        const connection = await createConnection({
            migrationsTransactionMode: 'all',
            type: 'mysql',
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            username: this.dbConfig.user,
            password: this.dbConfig.password,
            database: databaseName,
            entities: [join(__dirname, '../../../../db/companies/entities/**/*.entity{.ts,.js}')],
        });

        try {
            const userRepository =  connection.getRepository(User);
            const moduleRepository = connection.getRepository(Module);

            const allPermissions = await moduleRepository.find({
                relations: ['actions', 'options']
            });
            
            const permissions = allPermissions.map(({ id, actions, options}) => {
                return {
                    module: {
                        id
                    },
                    actions,
                    options,
                }
            })

            await userRepository.save({
                name: user.name,
                email: user.email,
                phone: user.phone,
                uuid: user.uuid,
                permissions
            });

        } catch (error) {
            throw error;
        } finally {
            await connection.close();
        }
  }
}