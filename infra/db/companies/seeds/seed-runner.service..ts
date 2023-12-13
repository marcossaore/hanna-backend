import { SeedProtocol } from './protocols/seed.protocol'
import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'

@Injectable()
export class SeedRunnerService implements SeedProtocol<Connection> {
  constructor(private readonly seeders: SeedProtocol<Connection>[]) {}

  async seed(connection: Connection): Promise<void> {
    for await (const seeder of this.seeders) {
      await seeder.seed(connection)
    }
  }
}
