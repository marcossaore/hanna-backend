import { SeedProtocol } from '../protocols/seed.protocol'
import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'
import { Module } from '../../entities/module/module.entity'
import { Grant } from '../../entities/module/grant.entity'

@Injectable()
export class AddModulesSeedService implements SeedProtocol<Connection> {
  async seed(connection: Connection) {
    const grantRepository = connection.getRepository(Grant)
    const moduleRepository = connection.getRepository(Module)

    const allGrants = await grantRepository.find()

    const salesModule = await moduleRepository.findOne({
      where: {
        name: 'sales'
      }
    })

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
      })
    }

    const bathGroomingModule = await moduleRepository.findOne({
      where: {
        belongsTo: 'bathGrooming'
      }
    })

    if (!bathGroomingModule) {
      await moduleRepository.save({
        name: 'schedule',
        belongsTo: 'bathGrooming',
        grants: allGrants
      })

      await moduleRepository.save({
        name: 'services',
        belongsTo: 'bathGrooming',
        grants: allGrants
      })

      await moduleRepository.save({
        name: 'plans',
        belongsTo: 'bathGrooming',
        grants: allGrants
      })
    }

    const petsModule = await moduleRepository.findOne({
      where: {
        name: 'pets'
      }
    })

    if (!petsModule) {
      await moduleRepository.save({
        name: 'pets',
        grants: allGrants
      })
    }

    const customersModule = await moduleRepository.findOne({
      where: {
        name: 'customers'
      }
    })

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
      })
    }

    const productsModule = await moduleRepository.findOne({
      where: {
        name: 'products'
      }
    })

    if (!productsModule) {
      await moduleRepository.save({
        name: 'products',
        grants: allGrants
      })
    }
  }
}
