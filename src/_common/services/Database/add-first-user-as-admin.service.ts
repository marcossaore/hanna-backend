import { Injectable } from "@nestjs/common";
import { createConnection  } from "typeorm";
import { join } from "path";
import { User } from "@db/companies/entities/user/user.entity";
import { Module } from "@db/companies/entities/module/module.entity";
import { Role } from "@db/companies/entities/module/role.entity";

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
            const roleRepository =  connection.getRepository(Role);

            const adminRole = await roleRepository.findOne({
                relations: ['permissions'],
                where: {
                    name: 'admin'
                }
            });

            await userRepository.save({
                name: user.name,
                email: user.email,
                phone: user.phone,
                uuid: user.uuid,
                role: adminRole
            });

        } catch (error) {
            throw error;
        } finally {
            await connection.close();
        }
  }
}