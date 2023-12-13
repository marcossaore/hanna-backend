import { SeedProtocol } from '../protocols/seed.protocol'
import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'
import { Grant } from '../../entities/module/grant.entity'

@Injectable()
export class AddGrantsSeedService implements SeedProtocol<Connection> {
  async seed(connection: Connection) {
    const grantRepository = connection.getRepository(Grant)
    const totalActions = await grantRepository.count()
    if (totalActions === 0) {
      await grantRepository.save([
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
      ])
    }
  }
}
