import { SeedProtocol } from '../protocols/seed.protocol'
import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'
import { Carry } from '../../entities/carry/carry.entity'

@Injectable()
export class AddCarriesSeedService implements SeedProtocol<Connection> {
  async seed(connection: Connection) {
    const carryRepository = connection.getRepository(Carry)
    const totalCarries = await carryRepository.count()
    if (totalCarries === 0) {
      await carryRepository.save([
        {
          name: 'small'
        },
        {
          name: 'medium'
        },
        {
          name: 'large'
        },
        {
          name: 'xlarge'
        }
      ])
    }
  }
}
