import { SeedProtocol } from '../protocols/seed.protocol'
import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'
import { Service } from '../../entities/service/service.entity'
import { ServiceCarry } from '../../entities/service/service-carry.entity'
import { Carry } from '../../entities/carry/carry.entity'

@Injectable()
export class AddServicesSeedService implements SeedProtocol<Connection> {
  async seed(connection: Connection) {
    const serviceRepository = connection.getRepository(Service)
    const serviceCarryRepository = connection.getRepository(ServiceCarry)
    const totalServices = await serviceRepository.count()
   
    if (totalServices === 0) {
      const carryRepository = connection.getRepository(Carry)
      const carries = await carryRepository.find()
      const services = ['Banho', 'Tosa']

      for (const name of services) {
        const service = await serviceRepository.save({
          name
        })
        
        for (const carry of carries) {
          await serviceCarryRepository.save([
            {
              service: {
                id: service.id
              },
              carry,
              price: 0
            }
          ])
        }
      }
    }
  }
}
