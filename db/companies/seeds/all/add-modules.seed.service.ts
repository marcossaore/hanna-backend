import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { Module } from "../../entities/module/module.entity";
import { Grant } from "../../entities/module/grant.entity";

@Injectable()
export class AddModulesSeedService implements SeedProtocol<Connection> {
    async seed(connection: Connection) {

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
  }
}