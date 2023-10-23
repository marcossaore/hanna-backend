import { Injectable } from "@nestjs/common";
import { createConnection } from "typeorm";
import { ActionModule } from "../entities/module/action-module.entity";
import { Module as ModuleEntity } from "../entities/module/module.entity";
import { join } from "path";

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
            const actionRepository = connection.getRepository(ActionModule);
            const moduleRepository = connection.getRepository(ModuleEntity);
    
            const allActions = await actionRepository.find();
    
            const salesModule = await moduleRepository.findOne({
                where: {
                    name: 'sales'
                }
            });
    
            if (!salesModule) {
                await moduleRepository.save({
                    name: 'sales',
                    actions: allActions,
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
                    actions: allActions,
                });
    
                await moduleRepository.save({
                    name: 'schedule',
                    actions: allActions,
                    parent: bathGroomingModule
                });
        
                await moduleRepository.save({
                    name: 'services',
                    actions: allActions,
                    parent: bathGroomingModule
                });
        
                await moduleRepository.save({
                    name: 'plans',
                    actions: allActions,
                    parent: bathGroomingModule
                });
            }
    
            const petsModule = await moduleRepository.findOne({
                where: {
                    name: 'pets'
                }
            });
    
            if (!petsModule) {
                await moduleRepository.save({
                    name: 'pets',
                    actions: allActions
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
                    actions: allActions,
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
            
        } catch (error) { 
            throw error;
        } finally {
            await connection.close();
        }
  }
}