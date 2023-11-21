import { Injectable } from "@nestjs/common";
import { createConnection } from "typeorm";
import { Module } from "../entities/module/module.entity";
import { join } from "path";
import { Role } from "../entities/module/role.entity";
import { Grant } from "../entities/module/grant.entity";

@Injectable()
export class ModuleServiceSeed {
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
            const grantRepository = connection.getRepository(Grant);
            const moduleRepository = connection.getRepository(Module);
    
            const allGrants = await grantRepository.find();
    
            const salesModule = await moduleRepository.findOne({
                where: {
                    name: 'sales'
                }
            });
    
            if (!salesModule) {
                await moduleRepository.save({
                    name: 'sales',
                    grants: allGrants,
                    options: [
                        {
                            name: 'pinPass'
                        },
                        {
                            name: 'accountMode'
                        }
                    ]
                });
            }
    
            let bathGroomingModule = await moduleRepository.findOne({
                where: {
                    name: 'bathGrooming'
                }
            });
    
            if (!bathGroomingModule) {
                bathGroomingModule = await moduleRepository.save({
                    name: 'bathGrooming',
                    grants: allGrants,
                });
    
                await moduleRepository.save({
                    name: 'schedule',
                    grants: allGrants,
                });
        
                await moduleRepository.save({
                    name: 'services',
                    grants: allGrants,
                });
        
                await moduleRepository.save({
                    name: 'plans',
                    grants: allGrants,
                });
            }
    
            const petsModule = await moduleRepository.findOne({
                where: {
                    name: 'pets'
                }
            });
    
            if (!petsModule) {
                await moduleRepository.save({
                    name: 'pets'
                });
            }
    
            const customersModule = await moduleRepository.findOne({
                where: {
                    name: 'customers'
                }
            });
    
            if (!customersModule) {
                await moduleRepository.save({
                    name: 'customers',
                    grants: allGrants,
                    options: [
                        {
                            name: 'bill'
                        },
                        {
                            name: 'bindPlan'
                        }
                    ]
                });
            }

            const allModules = await moduleRepository.find({
                relations: ['grants', 'options']
            });

            const associatePermissions = [];

            for (const module of allModules) {
                associatePermissions.push({
                    module: {
                        id: module.id
                    },
                    grants: module.grants,
                    options: module.options
                })
            }

            const roleRepository = connection.getRepository(Role);
            await roleRepository.save({
                name: 'admin',
                permissions: associatePermissions
            })
            
        } catch (error) { 
            throw error;
        } finally {
            await connection.close();
        }
  }
}