import { Module } from '@nestjs/common'
import { CommandModule } from 'nestjs-command'
import { ConfigModule } from '@nestjs/config'
import configuration from '@/shared/config/configuration'
import { RunMigrationsAndSeedersToTenantiesCommand } from './run-migrations-and-seeders-to-tenanties.command'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    CommandModule,
    RunMigrationsAndSeedersToTenantiesCommand
  ]
})
export class InitCommandHandlerModule {}
